import { updateAuthor as updateAuthorAPI } from '../../services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useUpdateAuthor() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { isPending, mutate: updateAuthor } = useMutation({
      mutationFn: updateAuthorAPI,
      onSuccess: () => [
         toast.success('Profile successfully updated'),
         queryClient.invalidateQueries({
            queryKey: ['activeAuthor'],
         }),
         navigate(-1),
      ],
      onError: (err) => toast.error(err.message),
   });
   return { isPending, updateAuthor };
}
