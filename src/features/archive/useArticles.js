import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getArticles } from '../../services/apiArticles';
import { useDebounce } from '../../hooks/useDebounce';
import { PAGE_SIZE } from '../../utils/constants';

export function useArticles() {
   const queryClient = useQueryClient();
   const [searchParams] = useSearchParams();

   // 1. Filter
   const filterValue = searchParams.get('status');
   const filter =
      !filterValue || filterValue === 'all'
         ? null
         : { field: 'status', value: filterValue, method: 'eq' };

   // 2. Sort
   const params = searchParams.get('sort-by') || 'created_at-desc';
   const [field, direction] = params.split('-');
   const sortBy = { field, direction };

   // 3. Search
   const searchRaw = searchParams.get('search');
   const search = useDebounce(searchRaw, 200);

   // 4. Pagination
   const page = !searchParams.get('page')
      ? 1
      : Number(searchParams.get('page'));

   // Query
   const {
      isPending,
      isPlaceholderData,
      data: { data: articles, count } = {},
   } = useQuery({
      queryKey: ['articles', filter, sortBy, page, search],
      queryFn: () => getArticles({ filter, sortBy, page, search }),
   });

   // Pre-fetching
   const pageCount = Math.ceil(count / PAGE_SIZE);

   if (page < pageCount)
      queryClient.prefetchQuery({
         queryKey: ['articles', filter, sortBy, page + 1],
         queryFn: () => getArticles({ filter, sortBy, page: page + 1 }),
      });

   if (page > 1)
      queryClient.prefetchQuery({
         queryKey: ['articles', filter, sortBy, page - 1],
         queryFn: () => getArticles({ filter, sortBy, page: page - 1 }),
      });

   return { isPending, isPlaceholderData, articles, count };
}
