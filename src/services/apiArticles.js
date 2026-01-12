import supabase, { supabaseUrl } from './supabase';
import {
   base64ToFile,
   createImagePath,
   getArticleChanges,
   getToday,
   isBase64Image,
} from '../utils/helpers';
import { PAGE_SIZE } from '../utils/constants';

export async function getArticles({ filter, sortBy, page, search }) {
   // 1. Fetch current author
   const { data: session } = await supabase.auth.getSession();
   if (!session.session) return null;

   const { data: author, error: errorAuthor } = await supabase.auth.getUser();

   if (errorAuthor) throw new Error('Author could not be fetched');

   let query = supabase
      .from('articles')
      .select('*, categories(*), authors(*)', { count: 'exact' });

   // 2. Filter
   if (filter) {
      if (filter.value === 'my-article') {
         query = query['eq']('author_id', author.user.id);
      } else {
         query = query[filter.method || 'eq'](filter.field, filter.value);
      }
   }

   // 3. Sort
   if (sortBy)
      query = query.order(sortBy.field, {
         ascending: sortBy.direction === 'asc',
      });

   // 4. Search
   if (search) query = query.ilike('title', `%${search}%`);

   // 5. Pagination
   if (page) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);
   }

   // 6. Await data
   const { data, error, count } = await query;

   if (error) throw new Error('Articles could not be loaded');

   return { data, count };
}

export async function getArticle(articleID) {
   const { data, error } = await supabase
      .from('articles')
      .select('*, categories (*), authors (*)')
      .eq('id', articleID)
      .single();

   if (error) throw new Error('Article could not be loaded');

   return data;
}

export async function createArticle(newArticle) {
   let imageFile = newArticle.image;

   if (isBase64Image(newArticle.image)) {
      imageFile = base64ToFile(newArticle.image, `image-${Date.now()}.jpg`);
   }

   const [imageName, imagePath] = createImagePath(imageFile);

   // - 1. Create article
   const { error } = await supabase
      .from('articles')
      .insert([{ ...newArticle, image: imagePath }]);

   if (error) throw new Error('Article could not be created');

   // - 2. Upload image
   const { error: storageError } = await supabase.storage
      .from('article_images')
      .upload(imageName, imageFile);

   if (storageError) throw new Error('Article image could not be uploaded');

   // - 3. Trigger Next.js revalidation
   if (newArticle.status === 'published') {
      await fetch('/api/revalidate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            slug: newArticle.slug,
            changes: { action: 'create' },
         }),
      });
   }
}

export async function updateArticle(article) {
   const oldArticle = article.oldArticle;

   // 1. Handle image upload if needed
   let finalImagePath = oldArticle.image;
   let imageFile = article.image;

   if (isBase64Image(article.image)) {
      imageFile = base64ToFile(article.image, `image-${Date.now()}.jpg`);
   }

   if (article.image.startsWith(supabaseUrl)) {
      imageFile = null;
   }

   if (imageFile) {
      const [imageName, imagePath] = createImagePath(imageFile);

      const { error: storageError } = await supabase.storage
         .from('article_images')
         .upload(imageName, imageFile);

      if (storageError) throw new Error('Article image could not be uploaded');

      finalImagePath = imagePath;
   }

   // 2. Update article in database
   const { error } = await supabase
      .from('articles')
      .update({
         title: article.title,
         description: article.description,
         content: article.content,
         category_id: article.category_id,
         status: article.status,
         slug: article.slug,
         code: article.code,
         image: finalImagePath,
         updated_at: new Date().toISOString(),
      })
      .eq('id', article.id)
      .select();

   if (error) throw new Error('Article could not be updated');

   // 3. Trigger Next.js revalidation
   if (article.status === 'published') {
      const changes = getArticleChanges(oldArticle, article);
      const relevantChanges = {
         content: changes.content,
         metadata: changes.title || changes.description || imageFile,
         action: 'update',
      };

      await fetch('/api/revalidate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            slug: article.slug,
            changes: relevantChanges,
         }),
      });
   }

   // 4. Delete old image if a new one was uploaded
   if (imageFile && oldArticle.image) {
      const oldImageName = oldArticle.image.split('/').pop();
      const { error: imageError } = await supabase.storage
         .from('article_images')
         .remove([oldImageName]);

      if (imageError)
         throw new Error('Old article image could not be deleted from storage');
   }
}

export async function deleteArticle(article) {
   // 1. Delete article
   const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);

   if (error) throw new Error('Article could not be deleted');

   // 2. Delete image from DB
   const imageName = article.image.split('/').pop();
   const { error: image2 } = await supabase.storage
      .from('article_images')
      .remove([imageName]);

   if (image2) throw new Error('Image could not be deleted from database');

   // - 3. Trigger Next.js revalidation
   if (article.status === 'published') {
      await fetch('/api/revalidate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            slug: article.slug,
            changes: { action: 'delete' },
         }),
      });
   }
}

export async function getArticlesAfterDate(date) {
   const { data, error } = await supabase
      .from('articles')
      .select('created_at, status, category_id, likes(id, type)')
      .gte('created_at', date)
      .lte('created_at', getToday({ end: true }));

   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getPublishedArticles({ search }) {
   let query = supabase
      .from('articles')
      .select('id, category_id, title, image, main_feature, featured')
      .eq('status', 'published')
      .order('id', { ascending: false });

   if (search) query = query.ilike('title', `%${search}%`);
   const { data, error } = await query;

   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getDraftedArticles() {
   const { data, error } = await supabase
      .from('articles')
      .select('id, author_id, title, image')
      .eq('status', 'drafted');

   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getFeaturedArticles() {
   const { data, error } = await supabase
      .from('articles')
      .select(
         'id, title, image, description, category_id, author_id, created_at'
      )
      .eq('featured', true)
      .eq('status', 'published');

   if (error) throw new Error('Featured articles could not be loaded');

   return data;
}

export async function getMainFeatureArticles() {
   const { data, error } = await supabase
      .from('articles')
      .select('id, title, image, description, index')
      .eq('main_feature', true)
      .eq('status', 'published')
      .order('index');

   if (error) throw new Error('Featured articles could not be loaded');

   return data;
}

export async function getComments() {
   const { data: data1, error } = await supabase.from('comments').select('id');
   if (error) throw new Error(error.message);

   const { data: data2, error: error2 } = await supabase
      .from('replies')
      .select('id');
   if (error2) throw new Error(error2.message);

   const data = [...data1, ...data2];

   return data;
}

export async function getLikes() {
   const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('type', 'article');

   if (error) throw new Error(error.message);

   return data;
}

export async function updateFeatures(article) {
   const { error } = await supabase
      .from('articles')
      .update({
         main_feature: article.main_feature,
         featured: article.featured,
      })
      .eq('id', article.id)
      .select();

   if (error) throw new Error(error.message);
}
