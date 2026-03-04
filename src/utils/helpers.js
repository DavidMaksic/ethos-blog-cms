/* eslint-disable no-unused-vars */

import {
   BlockNoteSchema,
   defaultBlockSpecs,
   insertOrUpdateBlock,
} from '@blocknote/core';
import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash';
import { withMultiColumn } from '@blocknote/xl-multi-column';
import { supabaseUrl } from '../services/supabase';
import { Alert } from '../ui/Alert';
import slugify, { extend } from 'slugify';

export function createImagePath(file) {
   if (!file || !file.type) throw new Error('Invalid file provided');

   const ext = file.type.split('/')[1];
   const imageName = `${Date.now()}.${ext}`;
   const imagePath = `${supabaseUrl}/storage/v1/object/public/article_images/${imageName}`;

   return [imageName, imagePath];
}

export function isBase64Image(value) {
   return typeof value === 'string' && value.startsWith('data:image/');
}

export function base64ToFile(base64, filename) {
   const [meta, data] = base64.split(',');
   const mime = meta.match(/:(.*?);/)[1];
   const binary = atob(data);

   const array = new Uint8Array(binary.length);
   for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
   }

   return new File([array], filename, { type: mime });
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
   }),
);

export const getImageDimensions = (url) =>
   new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () =>
         resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 1920, height: 1080 });
      img.src = url;
   });

export const appendDimensionsToHTML = async (html) => {
   const parser = new DOMParser();
   const doc = parser.parseFromString(html, 'text/html');
   const images = doc.querySelectorAll('img');

   await Promise.all(
      [...images].map(async (img) => {
         const src = img.getAttribute('src');
         if (!src || src.includes('?w=')) return; // already processed

         const { width, height } = await getImageDimensions(src);
         const separator = src.includes('?') ? '&' : '?';
         img.setAttribute('src', `${src}${separator}w=${width}&h=${height}`);
      }),
   );

   return doc.body.innerHTML;
};

export async function generateBlurDataURL(file) {
   const bitmap = await createImageBitmap(file);

   const maxSize = 100;
   const scale = Math.min(maxSize / bitmap.width, maxSize / bitmap.height);
   const w = Math.min(Math.round(bitmap.width * scale), maxSize);
   const h = Math.min(Math.round(bitmap.height * scale), maxSize);

   const canvas = document.createElement('canvas');
   canvas.width = w;
   canvas.height = h;
   const ctx = canvas.getContext('2d');
   ctx.drawImage(bitmap, 0, 0, w, h);
   bitmap.close();

   const { data } = ctx.getImageData(0, 0, w, h);
   const isTransparent = data.some((val, i) => i % 4 === 3 && val < 255);

   const hash = rgbaToThumbHash(w, h, data);
   return { blurDataURL: thumbHashToDataURL(hash), isTransparent };
}
