import { getAllArticles } from '../../services/apiArticles';
import { useQuery } from '@tanstack/react-query';

export function useAllArticles() {
   const { isPending, data: articles } = useQuery({
      queryFn: () => getAllArticles(),
      queryKey: ['allArticles', 'all'],
   });

   return { isPending, articles };
}
