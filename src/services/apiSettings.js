import supabase from './supabase';

export async function getSettings() {
   const { data, error } = await supabase.from('settings').select().single();

   if (error) throw new Error('Settings could not be loaded');

   return data;
}

export async function updateSetting(newSetting) {
   const { data, error } = await supabase
      .from('settings')
      .update(newSetting)
      .eq('id', 1)
      .single();

   if (error) throw new Error('Setting could not be updated');

   return data;
}
