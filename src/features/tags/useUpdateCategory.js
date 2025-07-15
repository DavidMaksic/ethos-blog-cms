import toast from 'react-hot-toast';
import { updateCategory as updateCategoryAPI } from '../../services/apiTags';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCategory() {
   const queryClient = useQueryClient();

   const {
      isPending: isEditing,
      isSuccess,
      mutate: updateCategory,
   } = useMutation({
      mutationFn: updateCategoryAPI,
      onSuccess: () => [
         toast.success('Category successfully updated'),
         queryClient.invalidateQueries({
            queryKey: ['categories'],
         }),
      ],
      onError: (err) => toast.error(err.message),
   });
   return { isEditing, isSuccess, updateCategory };
}
