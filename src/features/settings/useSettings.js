import { getSettings } from '../../services/apiSettings';
import { useQuery } from '@tanstack/react-query';

export function useSettings() {
   const { isPending, data } = useQuery({
      queryKey: ['settings'],
      queryFn: getSettings,
   });

   return { isPending, data };
}
