import { getSettings } from '../../services/apiSettings';
import { useQuery } from '@tanstack/react-query';

export function useSettings() {
   const { isPending, data } = useQuery({
      queryFn: getSettings,
      queryKey: ['settings'],
   });

   return { isPending, data };
}
