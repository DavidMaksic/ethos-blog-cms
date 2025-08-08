import { updateFeatures } from '../../services/apiArticles';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useUnFeature() {
   const { isPending: isUnFeaturing, mutate: unFeature } = useMutation({
      mutationFn: updateFeatures,
      onError: (err) => toast.error(err.message),
   });
   return { isUnFeaturing, unFeature };
}
