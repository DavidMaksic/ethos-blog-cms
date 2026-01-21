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
         bg_light: colorLightBg.hex,
         text_light: colorLightText.hex,
         bg_dark: colorDarkBg.hex,
         text_dark: colorDarkText.hex,
         chart_color: colorChart.hex,
      })
      .eq('id', id)
      .select()
      .order('id', { ascending: true });

   if (error) throw new Error('Category could not be updated');
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

export async function updateTagFeature({ selectedID, boolean }) {
   const { error } = await supabase
      .from('articles')
      .update({
         featured: boolean,
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
