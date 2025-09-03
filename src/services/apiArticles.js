import supabase, { supabaseUrl } from './supabase';
import { createImagePath, getToday } from '../utils/helpers';
import { PAGE_SIZE } from '../utils/constants';

export async function getArticles({ filter, sortBy, page, search }) {
   // 1. Fetch current author
   const { data: session } = await supabase.auth.getSession();
   if (!session.session) return null;

   const { data: author, error: errorAuthor } = await supabase.auth.getUser();

   if (errorAuthor) throw new Error('Author could not be fetched');

   let query = supabase.from('articles').select('*', { count: 'exact' });

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

   // 3. Delete comments on this article
   const { error3 } = await supabase
      .from('comments')
      .delete()
      .eq('article_id', article.id);

   if (error3) throw new Error('Comments could not be deleted');

   // 5. Delete replies on this article
   const { error4 } = await supabase
      .from('replies')
      .delete()
      .eq('article_id', article.id);

   if (error4) throw new Error('Replies could not be deleted');

   // 6. Fetch all categories
   const { data: categories, error5 } = await supabase
      .from('categories')
      .select('id, articles');

   if (error5) throw new Error('Categories could not be fetched');

   // 7. Delete article reference in all categories
   const updatePromises = categories.map(async (category) => {
      try {
         const articles = JSON.parse(category.articles);
         const filtered = articles.filter((item) => item !== article.id);

         const { error } = await supabase
            .from('categories')
            .update({ articles: filtered })
            .eq('id', category.id);

         if (error) throw new Error('Category could not be updated');
      } catch (err) {
         console.error(err);
      }
   });

   await Promise.all(updatePromises);

   // 8. Fetch all bookmarks in users table
   const { data: bookmarks, error6 } = await supabase
      .from('users')
      .select('id, bookmarks');

   if (error6) throw new Error('Bookmarks could not be fetched');

   // 9. Delete article reference in all bookmarks
   const updatePromise = bookmarks.map(async (user) => {
      try {
         const bookmarks = JSON.parse(user.bookmarks);
         const filtered = bookmarks.filter((item) => item !== article.id);

         const { error } = await supabase
            .from('users')
            .update({ bookmarks: filtered })
            .eq('id', user.id);

         if (error) throw new Error('Bookmark could not be updated');
      } catch (err) {
         console.error(err);
      }
   });

   await Promise.all(updatePromise);

   // 10. Fetch all likes in users table
   const { data: likes, error7 } = await supabase
      .from('users')
      .select('id, liked');

   if (error7) throw new Error('Liked article IDs could not be fetched');

   // 11. Delete article reference in all likes array
   const updateAllPromises = likes.map(async (user) => {
      try {
         const likes = JSON.parse(user.liked);
         const filtered = likes.filter((item) => item !== article.id);

         const { error } = await supabase
            .from('users')
            .update({ liked: filtered })
            .eq('id', user.id);

         if (error) throw new Error('Liked article IDs could not be updated');
      } catch (err) {
         console.error(err);
      }
   });

   await Promise.all(updateAllPromises);
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
            categoryID: article.categoryID,
            status: article.status,
            language: article.language,
            flag: article.flag,
            image: imagePath,
            slug: article.slug,
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
         categoryID: article.categoryID,
         status: article.status,
         language: article.language,
         flag: article.flag,
         slug: article.slug,
      })
      .eq('id', article.id)
      .select();

   if (error) throw new Error('Article could not be updated');
}

export async function getArticlesAfterDate(date) {
   const { data, error } = await supabase
      .from('articles')
      .select('created_at, status, categoryID, likes')
      .gte('created_at', date)
      .lte('created_at', getToday({ end: true }));

   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getPublishedArticles({ search }) {
   let query = supabase.from('articles').select().eq('status', 'published');
   if (search) query = query.ilike('title', `%${search}%`);

   const { data, error } = await query;

   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getDraftedArticles() {
   const { data, error } = await supabase
      .from('articles')
      .select()
      .eq('status', 'drafted');

   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getFeaturedArticles() {
   const { data, error } = await supabase
      .from('articles')
      .select()
      .eq('featured', true);

   if (error) throw new Error('Featured articles could not be loaded');

   return data;
}

export async function getMainFeatureArticles() {
   const { data, error } = await supabase
      .from('articles')
      .select()
      .eq('main_feature', true)
      .eq('status', 'published')
      .order('index');

   if (error) throw new Error('Featured articles could not be loaded');

   return data;
}

export async function getComments() {
   const { data: data1, error } = await supabase.from('comments').select('id');
   if (error) throw new Error(error.message);

   const { data: data2, error2 } = await supabase.from('replies').select('id');
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

   // Fetch all categories
   const { data: categories, error2 } = await supabase
      .from('categories')
      .select('id, articles');

   if (error2) throw new Error('Categories could not be fetched');

   // Delete article reference in all categories
   const promises = categories.map(async (category) => {
      try {
         const articles = JSON.parse(category.articles);
         const filtered = articles.filter((item) => item !== article.id);

         const { error } = await supabase
            .from('categories')
            .update({ articles: filtered })
            .eq('id', category.id);

         if (error) throw new Error('Category could not be updated');
      } catch (err) {
         console.error(err);
      }
   });

   await Promise.all(promises);
}
