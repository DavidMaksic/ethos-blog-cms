import { getLikes } from '../services/apiArticles';
import { useQuery } from '@tanstack/react-query';

export function useLikes() {
   const { data: likes } = useQuery({
      queryFn: getLikes,
      queryKey: ['likes'],
   });

   return { likes };
}
