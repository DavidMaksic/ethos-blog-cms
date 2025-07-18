import { getComments } from '../services/apiArticles';
import { useQuery } from '@tanstack/react-query';

export function useComments() {
   const { isPending, data: comments } = useQuery({
      queryFn: getComments,
      queryKey: ['comments'],
   });

   return { isPending, comments };
}
