import { getCurrentAuthor } from '../../services/apiAuth';
import { useQuery } from '@tanstack/react-query';

export function useCurrentAuthor() {
   const { isPending, data: user } = useQuery({
      queryFn: getCurrentAuthor,
      queryKey: ['activeAuthor'],
   });

   return { isPending, user, isAuthenticated: user?.role === 'authenticated' };
}
