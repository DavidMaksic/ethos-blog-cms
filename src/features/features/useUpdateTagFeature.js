import toast from 'react-hot-toast';
import { updateTagFeature as updateTagFeatureAPI } from '../../services/apiTags';
import { useMutation } from '@tanstack/react-query';

export function useUpdateTagFeature() {
   const {
      isPending: isEditing,
      isSuccess,
      mutate: updateTagFeature,
   } = useMutation({
      mutationFn: ({ selectedID, categoryID, boolean }) =>
         updateTagFeatureAPI({ selectedID, categoryID, boolean }),
      onError: (err) => toast.error(err.message),
   });
   return { isEditing, isSuccess, updateTagFeature };
}
