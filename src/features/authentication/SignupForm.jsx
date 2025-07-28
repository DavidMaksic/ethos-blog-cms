import { useSignup } from './useSignup';
import { useForm } from 'react-hook-form';

import SubmitButton from '../../ui/Buttons/SubmitButton';
import ClearButton from '../../ui/Buttons/ClearButton';
import FormItem from '../../ui/Form/FormItem';
import FormRow from '../../ui/Form/FormRow';
import Form from '../../ui/Form/Form';

function SignupForm() {
   const { isPending, isSuccess, signup } = useSignup();
   const { register, handleSubmit, formState, getValues, reset } = useForm();
   const { errors } = formState;

   function onSubmit({ full_name, email, password }) {
      signup(
         {
            full_name,
            email,
            password,
         },
         {
            onSettled: resetInputs,
         }
      );
   }

   function resetInputs() {
      reset({
         full_name: '',
         email: '',
         password: '',
         passwordConfirm: '',
      });
   }

   return (
      <Form isPending={isPending}>
         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[34rem]">
            <FormItem label="Full name" error={errors?.full_name?.message}>
               <input
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none"
                  id="full_name"
                  type="text"
                  {...register('full_name', {
                     required: '*',
                     minLength: {
                        value: 2,
                        message: 'Minimum of 2 characters',
                     },
                     maxLength: {
                        value: 40,
                        message: 'Maximum of 40 characters',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[34rem]">
            <FormItem label="Email address" error={errors?.email?.message}>
               <input
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none"
                  id="email"
                  type="text"
                  autoComplete="username"
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

         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[34rem]">
            <FormItem label="Password" error={errors?.password?.message}>
               <input
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none mb-2"
                  id="password"
                  type="password"
                  autoComplete="one-time-code"
                  {...register('password', {
                     required: '*',
                     minLength: {
                        value: 8,
                        message: 'Minimum of 8 characters',
                     },
                     maxLength: {
                        value: 128,
                        message: 'Minimum of 128 characters',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[34rem]">
            <FormItem
               label="Repeat password"
               error={errors?.passwordConfirm?.message}
            >
               <input
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none mb-2"
                  id="passwordConfirm"
                  type="password"
                  autoComplete="one-time-code"
                  {...register('passwordConfirm', {
                     required: '*',
                     validate: (value) =>
                        value === getValues().password ||
                        'Passwords need to match',
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow className="grid-cols-[auto]">
            <div className="flex justify-self-center">
               <SubmitButton
                  isPending={isPending}
                  isSuccess={isSuccess}
                  loadingText="Signing up"
                  handler={handleSubmit(onSubmit)}
               >
                  Sign up
               </SubmitButton>
            </div>
         </FormRow>

         <ClearButton handler={resetInputs} style="right-7" />
      </Form>
   );
}

export default SignupForm;
