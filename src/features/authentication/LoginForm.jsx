import { useLogin } from './useLogin';
import { useForm } from 'react-hook-form';

import SubmitButton from '../../ui/Buttons/SubmitButton';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import Form from '../../ui/Forms/Form';

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
         },
      );
   }

   return (
      <Form isPending={isPending} onSubmit={handleSubmit(onSubmit)}>
         <FormRow columns="grid-cols-[32rem]">
            <FormItem label="Email address" error={errors?.email?.message}>
               <input
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none"
                  id="email"
                  type="text"
                  {...register('email', {
                     required: '*',
                     pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email address',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[auto]">
            <FormItem label="Password" error={errors?.password?.message}>
               <input
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2"
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
               <SubmitButton isPending={isPending} loadingText="Signing in">
                  Sign in
               </SubmitButton>
            </div>
         </FormRow>
      </Form>
   );
}

export default LoginForm;
