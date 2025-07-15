import { useQuery } from '@tanstack/react-query';
import { getCategories as getCategoriesAPI } from '../../services/apiTags';

export function useGetCategories() {
   const { data: categories } = useQuery({
      queryFn: getCategoriesAPI,
      queryKey: ['categories'],
   });

   return { categories };
}
