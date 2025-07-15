import supabase, { supabaseUrl } from './supabase';
import { createImagePath, getToday } from '../utils/helpers';
import { PAGE_SIZE } from '../utils/constants';

export async function getArticles({ filter, sortBy, page, search }) {
   let query = supabase.from('articles').select('*', { count: 'exact' });

   // 1. Filter
   if (filter) query = query[filter.method || 'eq'](filter.field, filter.value);

   // 2. Sort
   if (sortBy)
      query = query.order(sortBy.field, {
         ascending: sortBy.direction === 'asc',
      });

   // 3. Search
   if (search) query = query.ilike('title', `%${search}%`);

   // 4. Pagination
   if (page) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);
   }

   // Await data
   const { data, error, count } = await query;

   if (error) throw new Error('Articles could not be loaded');

   return { data, count };
}

export async function getTagArticles({ search }) {
   let query = supabase.from('articles').select();
   if (search) query = query.ilike('title', `%${search}%`);

   const { data, error } = await query;
   if (error) throw new Error('Articles could not be loaded');

   return data;
}

export async function getAllArticles() {
   const { data, error } = await supabase.from('articles').select();

   if (error) throw new Error('Articles could not be loaded');

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
   const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);

   if (error) throw new Error('Article could not be deleted');

   // - Delete image from DB
   const imageName = article.image.split('/').pop();
   const { error: imageError } = await supabase.storage
      .from('article_images')
      .remove([imageName]);

   if (imageError) throw new Error('Image could not be deleted from database');
}

export async function updateArticle(article) {
   const isFile = !article.image?.startsWith?.(supabaseUrl);

   if (isFile) {
      // - 1. Delete old image from DB
      const oldImageName = article.oldImage.split('/').pop();

      const { error: imageError } = await supabase.storage
         .from('article_images')
         .remove([oldImageName]);

      if (imageError)
         throw new Error('Image could not be deleted from database');

      // - 2. Upload new image
      const [imageName, imagePath] = createImagePath(article);

      // - 3. Edit article with new image
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
         })
         .eq('id', article.id)
         .select();

      if (error) throw new Error('Article could not be updated');

      // - 4. Upload new image
      const { error: storageError } = await supabase.storage
         .from('article_images')
         .upload(imageName, article.image);

      if (storageError) throw new Error('Article image could not be updated');
   }

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
      })
      .eq('id', article.id)
      .select();

   if (error) throw new Error('Article could not be updated');
}

export async function getArticlesAfterDate(date) {
   const { data, error } = await supabase
      .from('articles')
      .select('created_at, status, categoryID')
      .gte('created_at', date)
      .lte('created_at', getToday({ end: true }));

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
      .order('index');

   if (error) throw new Error('Featured articles could not be loaded');

   return data;
}
