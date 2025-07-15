import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser as updateUserAPI } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useUpdateUser() {
   const queryClient = useQueryClient();

   const { isPending, mutate: updateUser } = useMutation({
      mutationFn: updateUserAPI,
      onSuccess: () => [
         toast.success('Profile successfully updated'),
         queryClient.invalidateQueries({
            queryKey: ['user'],
         }),
      ],
      onError: (err) => toast.error(err.message),
   });
   return { isPending, updateUser };
}
