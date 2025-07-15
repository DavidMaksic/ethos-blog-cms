import { insertOrUpdateBlock } from '@blocknote/core';
import { supabaseUrl } from '../services/supabase';

export function createImagePath(article) {
   const imageNameOld = `${Math.random()}-${article.image.name}`.replaceAll(
      '/',
      ''
   );
   const imageName = imageNameOld.replaceAll(' ', '');

   const imagePath = `${supabaseUrl}/storage/v1/object/public/article_images/${imageName}`;

   return [imageName, imagePath];
}

export function getDefaults(searchParams, options) {
   const defaultValue = searchParams.get('sort-by') || options.at(0).value;

   let defaultLabel;
   options.forEach((item) => {
      if (defaultValue === item.value) defaultLabel = item.label;
   });

   return { defaultLabel, defaultValue };
}

export const getToday = function (options = {}) {
   const today = new Date();

   if (options?.end) today.setUTCHours(23, 59, 59, 999);
   else today.setUTCHours(0, 0, 0, 0);

   return today.toISOString();
};

export const insertAlert = (editor, icon) => ({
   title: 'Box',
   subtext: 'Info, warning and other boxes',
   onItemClick: () => {
      insertOrUpdateBlock(editor, {
         type: 'alert',
      });
   },
   aliases: ['info', 'warning', 'error', 'success'],
   group: 'Other',
   icon,
});

export function handleValidation(value, array) {
   const error = array.map((item) => value === item.category);
   let isDuplicate = false;

   error.map((item) => {
      if (item) isDuplicate = true;
   });

   if (isDuplicate) return 'This category already exists';
}
