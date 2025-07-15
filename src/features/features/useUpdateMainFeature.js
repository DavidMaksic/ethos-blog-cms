import toast from 'react-hot-toast';
import { updateMainFeature as updateMainFeatureAPI } from '../../services/apiTags';
import { useMutation } from '@tanstack/react-query';

export function useUpdateMainFeature() {
   const {
      isPending: isEditing,
      isSuccess,
      mutate: updateMainFeature,
   } = useMutation({
      mutationFn: ({ selectedID, boolean }) =>
         updateMainFeatureAPI({ selectedID, boolean }),
      onError: (err) => toast.error(err.message),
   });
   return { isEditing, isSuccess, updateMainFeature };
}
