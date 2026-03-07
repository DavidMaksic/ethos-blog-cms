import { useState, useEffect } from 'react';

const NEXT_APP_URL = import.meta.env.VITE_NEXT_APP_URL;

export function useUmamiStats(numDays) {
   const [visitors, setVisitors] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      async function fetchVisitors() {
         try {
            setIsLoading(true);

            const endAt = Date.now();
            const startAt = endAt - numDays * 24 * 60 * 60 * 1000;

            const res = await fetch(
               `${NEXT_APP_URL}/api/umami/pageviews?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            );

            if (!res.ok) throw new Error('Failed to fetch Umami data');

            const data = await res.json();
            // data = { pageviews: [{x, y}], sessions: [{x, y}] }
            setVisitors(data);
         } catch (err) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      }

      fetchVisitors();
   }, [numDays]);

   return { visitors, isLoading, error };
}
