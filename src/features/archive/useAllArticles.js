import { useQuery } from '@tanstack/react-query';
import { getAllArticles as getAllArticlesAPI } from '../../services/apiArticles';

export function useAllArticles() {
   const { isPending, data: articles } = useQuery({
      queryFn: getAllArticlesAPI,
      queryKey: ['allArticles'],
   });

   return { isPending, articles };
}
