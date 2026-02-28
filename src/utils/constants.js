const FULL_HD = 1912;
const XXL = 1300;

function getItemHeight() {
   const width = window.innerWidth;

   if (width >= FULL_HD) return 125;
   if (width >= XXL) return 100;
   return 125;
}

const itemHeight = getItemHeight();
const viewportHeight = window.innerHeight;
export const PAGE_SIZE = Math.floor(viewportHeight / itemHeight);

export const CONTENT_DEBOUNCE = 10000;
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

export const EXCLUDED_HEADINGS = ['песма', 'тропар', 'кондак'];
