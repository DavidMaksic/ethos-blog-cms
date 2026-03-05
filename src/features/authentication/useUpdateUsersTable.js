import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAuthorsTable as updateAuthorsTableApi } from '../../services/apiAuth';

export function useUpdateAuthorsTable() {
   const queryClient = useQueryClient();

   const { isPending, mutate: updateAuthorsTable } = useMutation({
      mutationFn: updateAuthorsTableApi,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ['authors'],
         });
      },
   });

   return { isPending, updateAuthorsTable };
}
