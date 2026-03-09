import { useState, useEffect } from 'react';

const NEXT_APP_URL = import.meta.env.VITE_NEXT_APP_URL;

export function useUmamiReferrers(numDays) {
   const [referrers, setReferrers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchReferrers() {
         try {
            setIsLoading(true);
            const endAt = Date.now();
            const startAt = endAt - numDays * 24 * 60 * 60 * 1000;

            const res = await fetch(
               `${NEXT_APP_URL}/api/umami/metrics?startAt=${startAt}&endAt=${endAt}&type=referrer`,
            );

            if (!res.ok) throw new Error('Failed to fetch referrers');

            const data = await res.json();
            setReferrers(data);
         } catch (err) {
            console.error(err);
         } finally {
            setIsLoading(false);
         }
      }

      fetchReferrers();
   }, [numDays]);

   return { referrers, isLoading };
}
