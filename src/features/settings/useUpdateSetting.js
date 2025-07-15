import toast from 'react-hot-toast';
import { updateSetting as updateSettingAPI } from '../../services/apiSettings';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateSetting() {
   const queryClient = useQueryClient();

   const { isPending: isUpdating, mutate: updateSetting } = useMutation({
      mutationFn: updateSettingAPI,
      onSuccess: () => {
         toast.success('Setting successfully updated');
         queryClient.invalidateQueries({ queryKey: ['settings'] });
      },
      onError: (err) => toast.error(err.message),
   });

   return { isUpdating, updateSetting };
}
