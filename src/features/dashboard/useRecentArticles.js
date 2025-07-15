import { useQuery } from '@tanstack/react-query';
import { subDays } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { getArticlesAfterDate } from '../../services/apiArticles';

export function useRecentArticles() {
   const [searchParams] = useSearchParams();

   const numDays = !searchParams.get('last')
      ? 7
      : Number(searchParams.get('last'));

   const queryDate = subDays(new Date(), numDays).toISOString();

   const { isPending, data: articles } = useQuery({
      queryFn: () => getArticlesAfterDate(queryDate),
      queryKey: ['articles', `last-${numDays}`],
   });

   return { isPending, articles, numDays };
}
