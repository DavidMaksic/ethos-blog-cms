import { signup as signupAPI } from '../../services/apiAuth';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast/headless';

export function useSignup() {
   const {
      isPending,
      isSuccess,
      mutate: signup,
   } = useMutation({
      mutationFn: signupAPI,
      onSuccess: () => {
         toast.success(
            'Account successfully created! Please verify new account from your email address'
         );
      },
   });

   return { isPending, isSuccess, signup };
}
