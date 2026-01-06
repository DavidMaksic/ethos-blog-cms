/* eslint-disable no-unused-vars */

import {
   BlockNoteSchema,
   defaultBlockSpecs,
   insertOrUpdateBlock,
} from '@blocknote/core';
import { withMultiColumn } from '@blocknote/xl-multi-column';
import { supabaseUrl } from '../services/supabase';
import { Alert } from '../ui/Alert';
import slugify, { extend } from 'slugify';

export function createImagePath(article) {
   const imageNameOld = `${Math.random()}-${article.image.name}`.replaceAll(
      '/',
      ''
   );
   const imageName = imageNameOld.replaceAll(' ', '');

   const imagePath = `${supabaseUrl}/storage/v1/object/public/article_images/${imageName}`;

   return [imageName, imagePath];
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
   aliases: ['info', 'warning', 'error', 'success', 'credit'],
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

extend({
   ч: 'c',
   Ч: 'C',
   ш: 's',
   Ш: 'S',
   ж: 'z',
   Ж: 'Z',
   ђ: 'dj',
   Ђ: 'Dj',
   љ: 'lj',
   Љ: 'Lj',
   њ: 'nj',
   Њ: 'Nj',
   џ: 'dz',
   Џ: 'Dz',
});

export function toSlug(string) {
   return slugify(string, {
      lower: true,
      strict: true,
   });
}

export function getArticleChanges(oldArticle, newArticle) {
   return {
      title: oldArticle.title !== newArticle.title,
      description: oldArticle.description !== newArticle.description,
      content: oldArticle.content !== newArticle.content,
   };
}

const { file, audio, emoji, checkListItem, codeBlock, table, ...rest } =
   defaultBlockSpecs;

export const blockNoteSchema = withMultiColumn(
   BlockNoteSchema.create({
      blockSpecs: {
         ...rest,
         alert: Alert,
      },
   })
);
