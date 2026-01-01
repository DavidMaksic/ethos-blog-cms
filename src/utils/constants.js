const itemHeight = 130; // px
const viewportHeight = window.innerHeight;
const itemsPerPage = Math.floor(viewportHeight / itemHeight);
export const PAGE_SIZE = itemsPerPage;

export const DEFAULT_LANG = 'en';
export const FLAGS = {
   en: '/en-flag.png',
   sr: '/sr-flag.png',
};
export const LANGUAGES = [
   {
      code: 'en',
      lang: 'English',
      flag: '/en-flag.png',
   },
   {
      code: 'sr',
      lang: 'Српски',
      flag: '/sr-flag.png',
   },
];
