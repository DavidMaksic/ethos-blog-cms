import { useSearchParams } from 'react-router-dom';
import { getTagArticles } from '../../services/apiArticles';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';

export function useTagArticles() {
   const [searchParams] = useSearchParams();

   // - Search
   const searchRaw = searchParams.get('search');
   const search = useDebounce(searchRaw, 200);

   // - Query
   const { isPending, data: articles } = useQuery({
      queryKey: ['tagArticles', search],
      queryFn: () => getTagArticles({ search }),
   });

   return { isPending, articles };
}
