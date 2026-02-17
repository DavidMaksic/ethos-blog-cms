import { signup as signupAPI } from '../../services/apiAuth';
import { useMutation } from '@tanstack/react-query';

export function useSignup() {
   const {
      isPending,
      isSuccess,
      mutate: signup,
   } = useMutation({
      mutationFn: signupAPI,
   });

   return { isPending, isSuccess, signup };
}
