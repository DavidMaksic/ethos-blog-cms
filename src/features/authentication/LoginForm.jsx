import { useLogin } from './useLogin';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';

import SubmitButton from '../../ui/Buttons/SubmitButton';
import FormItem from '../../ui/Form/FormItem';
import FormRow from '../../ui/Form/FormRow';

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
      <motion.form
         className={`label font-creator relative flex flex-col gap-8 bg-secondary dark:bg-primary-300/10 rounded-3xl text-lg text-[#4d525c] dark:text-slate-300/80 font-medium px-20 py-12 [&_input]:text-3xl box-shadow transition-200 ${
            isPending && 'pointer-events-none opacity-80'
         }`}
         onSubmit={handleSubmit(onSubmit)}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
      >
         <FormRow columns="grid-cols-[32rem]">
            <FormItem label="Email address" error={errors?.email?.message}>
               <input
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none"
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
               <SubmitButton isPending={isPending} loadingText="Logging in">
                  Login
               </SubmitButton>
            </div>
         </FormRow>
      </motion.form>
   );
}

export default LoginForm;
