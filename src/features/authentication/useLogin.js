import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginAPI } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useLogin() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   const { isPending, mutate: login } = useMutation({
      mutationFn: ({ email, password }) => loginAPI({ email, password }),
      onSuccess: (user) => {
         queryClient.setQueryData(['user'], user.user);
         navigate('/dashboard', { replace: true });
      },
      onError: () => toast.error('Invalid email or password'),
   });

   return { isPending, login };
}
