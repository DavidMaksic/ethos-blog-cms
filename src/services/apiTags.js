import supabase from './supabase';

export async function getCategories() {
   const { data, error } = await supabase
      .from('categories')
      .select()
      .order('id', { ascending: true });

   if (error) throw new Error('Categories could not be loaded');

   return data;
}

export async function createCategory(category) {
   const { error } = await supabase.from('categories').insert(category);

   if (error) throw new Error('Category could not be created');
}

export async function updateCategory(updateObject) {
   const {
      category,
      id,
      colorLightBg,
      colorLightText,
      colorDarkBg,
      colorDarkText,
      colorChart,
   } = updateObject;

   const { error } = await supabase
      .from('categories')
      .update({
         category: category,
         bgLight: colorLightBg.hex,
         textLight: colorLightText.hex,
         bgDark: colorDarkBg.hex,
         textDark: colorDarkText.hex,
         chartColor: colorChart.hex,
      })
      .eq('id', id)
      .select()
      .order('id', { ascending: true });

   if (error) throw new Error('Category could not be updated');
}

export async function updateTagFeature({ selectedID, categoryID, boolean }) {
   const { error } = await supabase
      .from('articles')
      .update({
         featured: boolean,
      })
      .eq('id', selectedID)
      .select();

   if (error) throw new Error('Article could not be featured');

   const {
      data: [articleIDs],
      error2,
   } = await supabase
      .from('categories')
      .select('articles')
      .eq('id', categoryID);

   if (error2) {
      throw new Error('Article IDs could not be fetched');
   }

   const allIDs = JSON.parse(articleIDs.articles)?.filter(
      (item) => item !== selectedID
   );

   if (boolean) {
      const { error3 } = await supabase
         .from('categories')
         .update({ articles: [...allIDs, selectedID] })
         .eq('id', categoryID)
         .select();

      if (error3) throw new Error('Category table could not be updated');
   }

   if (!boolean) {
      const { error4 } = await supabase
         .from('categories')
         .update({ articles: [...allIDs] })
         .eq('id', categoryID)
         .select();

      if (error4) throw new Error('Category table could not be updated');
   }
}

export async function updateMainFeature({ selectedID, boolean }) {
   const { error } = await supabase
      .from('articles')
      .update({
         main_feature: boolean,
         index: null,
      })
      .eq('id', selectedID)
      .select();

   if (error) throw new Error('Article could not be featured');
}

export async function setIndex({ selectedID, index }) {
   const { error } = await supabase
      .from('articles')
      .update({
         index,
      })
      .eq('id', selectedID)
      .select();

   if (error) throw new Error(' could not be featured');
}
