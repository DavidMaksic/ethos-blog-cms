import { useQuery } from '@tanstack/react-query';
import { getPublishedArticles } from '../../services/apiArticles';

export function usePublishedArticles() {
   const { isPending, data: articles } = useQuery({
      queryFn: getPublishedArticles,
      queryKey: ['allArticles'],
   });

   return { isPending, articles };
}
