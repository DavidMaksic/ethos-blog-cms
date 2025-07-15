import { getUsers } from '../../services/apiAuth';
import { useQuery } from '@tanstack/react-query';

export function useAuthors() {
   const { isPending, data: authors } = useQuery({
      queryFn: getUsers,
      queryKey: ['authors'],
   });

   return { isPending, authors };
}
