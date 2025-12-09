import { getComments } from '../services/apiArticles';
import { useQuery } from '@tanstack/react-query';

export function useComments() {
   const { data: comments } = useQuery({
      queryFn: getComments,
      queryKey: ['comments'],
   });

   return { comments };
}
