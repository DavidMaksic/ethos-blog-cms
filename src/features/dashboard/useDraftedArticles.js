import { getDraftedArticles } from '../../services/apiArticles';
import { useQuery } from '@tanstack/react-query';

export function useDraftedArticles() {
   const { isPending, data: articles } = useQuery({
      queryFn: getDraftedArticles,
      queryKey: ['drafted'],
   });

   return { isPending, articles };
}
