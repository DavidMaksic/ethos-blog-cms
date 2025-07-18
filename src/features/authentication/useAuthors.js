import { getAuthors } from '../../services/apiAuth';
import { useQuery } from '@tanstack/react-query';

export function useAuthors() {
   const { isPending, data: authors } = useQuery({
      queryFn: getAuthors,
      queryKey: ['authors'],
   });

   return { isPending, authors };
}
