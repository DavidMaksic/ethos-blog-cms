import { createCategory as createCategoryAPI } from '../../services/apiTags';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useCreateCategory() {
   const {
      isPending,
      isSuccess,
      mutate: createCategory,
   } = useMutation({
      mutationFn: createCategoryAPI,
      onSuccess: () => [toast.success('New category successfully created')],
      onError: (err) => toast.error(err.message),
   });

   return { isPending, isSuccess, createCategory };
}
