import { useState, useEffect } from 'react';

const NEXT_APP_URL = import.meta.env.VITE_NEXT_APP_URL;

const EXCLUDED_PREFIXES = ['/user/', '/sr/user/'];
const EXCLUDED_ROUTES = [
   '/',
   '/en',
   '/sr',
   '/about',
   '/archive',
   '/sr/about',
   '/sr/archive',
];

function isExcluded(url) {
   const clean = url.split('?')[0].split('#')[0];
   if (EXCLUDED_ROUTES.includes(clean)) return true;
   if (EXCLUDED_PREFIXES.some((prefix) => clean.startsWith(prefix)))
      return true;
   return false;
}

export function useUmamiTopPages(numDays) {
   const [pages, setPages] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchTopPages() {
         try {
            setIsLoading(true);
            const endAt = Date.now();
            const startAt = endAt - numDays * 24 * 60 * 60 * 1000;

            const res = await fetch(
               `${NEXT_APP_URL}/api/umami/top-pages?startAt=${startAt}&endAt=${endAt}`,
            );

            if (!res.ok) throw new Error('Failed to fetch top pages');

            const { current, previous } = await res.json();

            const filtered = current.filter((page) => !isExcluded(page.x));
            const filteredPrevious = previous.filter(
               (page) => !isExcluded(page.x),
            );

            const ranked = filtered
               .slice(0, 8)
               .map((page, index) => {
                  const normalizedUrl = page.x.split('?')[0].split('#')[0];
                  const parts = normalizedUrl.split('/').filter(Boolean);

                  const hasLangPrefix = ['en', 'sr'].includes(parts[0]);
                  const slug = hasLangPrefix
                     ? parts.slice(1).join('/')
                     : parts.join('/');

                  const prevIndex = filteredPrevious.findIndex(
                     (p) => p.x.split('?')[0].split('#')[0] === normalizedUrl,
                  );
                  const change = prevIndex === -1 ? null : prevIndex - index;

                  return {
                     url: normalizedUrl,
                     slug,
                     views: page.y,
                     rank: index + 1,
                     change,
                  };
               })
               .filter(
                  (page, _, arr) =>
                     arr.findIndex((p) => p.slug === page.slug) ===
                     arr.indexOf(page),
               )
               .map((page, index) => ({ ...page, rank: index + 1 }));

            setPages(ranked);
         } catch (err) {
            console.error(err);
         } finally {
            setIsLoading(false);
         }
      }

      fetchTopPages();
   }, [numDays]);

   return { pages, isLoading };
}
