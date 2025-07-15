import toast from 'react-hot-toast';
import { setIndex as setIndexAPI } from '../../services/apiTags';
import { useMutation } from '@tanstack/react-query';

export function useSetIndex() {
   const {
      isPending,
      isSuccess,
      mutate: setIndex,
   } = useMutation({
      mutationFn: ({ selectedID, index }) => setIndexAPI({ selectedID, index }),
      onError: (err) => toast.error(err.message),
   });
   return { isPending, isSuccess, setIndex };
}
