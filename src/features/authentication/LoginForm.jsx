import { useLogin } from './useLogin';
import { useForm } from 'react-hook-form';

import SubmitButton from '../../ui/Buttons/SubmitButton';
import FormItem from '../../ui/Form/FormItem';
import FormRow from '../../ui/Form/FormRow';
import Form from '../../ui/Form/Form';

function LoginForm() {
   const { register, handleSubmit, formState, reset } = useForm();
   const { errors } = formState;

   const { isPending, login } = useLogin();

   function onSubmit({ email, password }) {
      login(
         { email, password },
         {
            onSettled: () =>
               reset({
                  email: '',
                  password: '',
               }),
         }
      );
   }

   return (
      <Form isPending={isPending}>
         <FormRow columns="grid-cols-[32rem]">
            <FormItem label="Email address" error={errors?.email?.message}>
               <input
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none"
                  id="email"
                  type="text"
                  {...register('email', {
                     required: '*',
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[auto]">
            <FormItem label="Password" error={errors?.password?.message}>
               <input
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none mb-2"
                  id="password"
                  type="password"
                  autoComplete="one-time-code"
                  {...register('password', {
                     required: '*',
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow className="grid-cols-[auto]">
            <div className="flex justify-self-center">
               <SubmitButton
                  isPending={isPending}
                  loadingText="Logging in"
                  handler={handleSubmit(onSubmit)}
               >
                  Login
               </SubmitButton>
            </div>
         </FormRow>
      </Form>
   );
}

export default LoginForm;
