import { getPublishedArticles } from '../../services/apiArticles';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';

export function usePublishedArticles() {
   const [searchParams] = useSearchParams();

   // - Search
   const searchRaw = searchParams.get('search');
   const search = useDebounce(searchRaw, 200);

   // - Query
   const { isPending, data: articles } = useQuery({
      queryKey: ['publishedArticles', search],
      queryFn: () => getPublishedArticles({ search }),
   });

   return { isPending, articles };
}
