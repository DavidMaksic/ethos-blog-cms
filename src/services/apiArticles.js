import supabase, { supabaseUrl } from './supabase';
import { createImagePath, getToday } from '../utils/helpers';
import { PAGE_SIZE } from '../utils/constants';

export async function getArticles({ filter, sortBy, page, search }) {
   // 1. Fetch current author
   const { data: session } = await supabase.auth.getSession();
   if (!session.session) return null;

   const { data: author, error: errorAuthor } = await supabase.auth.getUser();

   if (errorAuthor) throw new Error('Author could not be fetched');

   let query = supabase
      .from('articles')
      .select('*, categories(*)', { count: 'exact' });

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
   const [imageName, imagePath] = createImagePath(newArticle);

   // - 1. Create article
   const { error } = await supabase
      .from('articles')
      .insert([{ ...newArticle, image: imagePath }]);

   if (error) throw new Error('Article could not be created');

   // - 2. Upload image
   const { error: storageError } = await supabase.storage
      .from('article_images')
      .upload(imageName, newArticle.image);

   if (storageError) throw new Error('Article image could not be uploaded');
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
}

export async function updateArticle(article) {
   const isFile = !article.image?.startsWith?.(supabaseUrl);

   // 1. IMAGE WAS CHANGED
   if (isFile) {
      // - Delete old image from DB
      const oldImageName = article.oldImage.split('/').pop();

      const { error: imageError } = await supabase.storage
         .from('article_images')
         .remove([oldImageName]);

      if (imageError)
         throw new Error('Image could not be deleted from database');

      // - Upload new image
      const [imageName, imagePath] = createImagePath(article);

      // - Edit article with new image
      const { error } = await supabase
         .from('articles')
         .update({
            title: article.title,
            description: article.description,
            content: article.content,
            category_id: article.category_id,
            status: article.status,
            language: article.language,
            flag: article.flag,
            image: imagePath,
            slug: article.slug,
            updated_at: new Date().toISOString(),
         })
         .eq('id', article.id)
         .select();

      if (error) throw new Error('Article could not be updated');

      // - Upload new image
      const { error: storageError } = await supabase.storage
         .from('article_images')
         .upload(imageName, article.image);

      if (storageError) throw new Error('Article image could not be updated');
   }

   // 2. IMAGE WASN'T CHANGED

   // - Edit article with old image
   const { error } = await supabase
      .from('articles')
      .update({
         title: article.title,
         description: article.description,
         content: article.content,
         category_id: article.category_id,
         status: article.status,
         language: article.language,
         flag: article.flag,
         slug: article.slug,
         updated_at: new Date().toISOString(),
      })
      .eq('id', article.id)
      .select();

   if (error) throw new Error('Article could not be updated');
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
      .select('id, category_id, title, image')
      .eq('status', 'published');
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
      .select('id, title, image, description')
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
