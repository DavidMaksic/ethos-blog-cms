import { useQuery } from '@tanstack/react-query';
import { getMainFeatureArticles as getMainFeatureArticlesAPI } from '../../services/apiArticles';

export function useGetMainFeatureArticles() {
   const { data: articles, refetch } = useQuery({
      queryFn: getMainFeatureArticlesAPI,
      queryKey: ['mainFeatureArticles'],
      enabled: false,
   });

   return { articles, refetch };
}
