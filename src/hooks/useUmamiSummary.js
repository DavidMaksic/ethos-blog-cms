import { useState, useEffect } from 'react';

const NEXT_APP_URL = import.meta.env.VITE_NEXT_APP_URL;

export function useUmamiSummary(numDays) {
   const [summary, setSummary] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      async function fetchSummary() {
         try {
            setIsLoading(true);
            const endAt = Date.now();
            const startAt = endAt - numDays * 24 * 60 * 60 * 1000;

            const res = await fetch(
               `${NEXT_APP_URL}/api/umami/stats?startAt=${startAt}&endAt=${endAt}`,
            );

            if (!res.ok) throw new Error('Failed to fetch Umami summary');

            const data = await res.json();
            setSummary(data);
         } catch (err) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      }

      fetchSummary();
   }, [numDays]);

   return { summary, isLoading, error };
}
