import { useQuery } from '@tanstack/react-query';
import { getMainFeatureArticles as getMainFeatureArticlesAPI } from '../../services/apiArticles';

export function useGetMainFeatureArticles() {
   const {
      isPending,
      data: articles,
      refetch,
   } = useQuery({
      queryFn: getMainFeatureArticlesAPI,
      queryKey: ['mainFeatureArticles'],
      enabled: false,
   });

   return { isPending, articles, refetch };
}
