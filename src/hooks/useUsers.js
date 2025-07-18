import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/apiAuth';

export function useUsers() {
   const { isPending, data: users } = useQuery({
      queryFn: getUsers,
      queryKey: ['users'],
   });

   return { isPending, users };
}
