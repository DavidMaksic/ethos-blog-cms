import { useQuery } from '@tanstack/react-query';
import { getFeaturedArticles as getFeaturedArticlesAPI } from '../../services/apiArticles';

export function useGetFeaturedArticles() {
   const { data: articles, refetch } = useQuery({
      queryFn: getFeaturedArticlesAPI,
      queryKey: ['featuredArticles'],
      enabled: false,
   });

   return { articles, refetch };
}
