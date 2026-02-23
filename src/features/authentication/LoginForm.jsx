import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion, AnimatePresence } from 'motion/react';
import { useLogin } from './useLogin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import SubmitButton from '../../ui/Buttons/SubmitButton';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import Form from '../../ui/Forms/Form';

function LoginForm() {
   const { register, handleSubmit, formState, reset } = useForm();
   const { errors } = formState;
   const { isPending, login } = useLogin();

   const [showPassword, setShowPassword] = useState(false);
   const [passwordValue, setPasswordValue] = useState('');

   function onSubmit({ email, password }) {
      login(
         { email, password },
         {
            onSettled: () => {
               setPasswordValue('');
               setShowPassword(false);
               reset({
                  email: '',
                  password: '',
               });
            },
         },
      );
   }

   return (
      <Form isPending={isPending} onSubmit={handleSubmit(onSubmit)}>
         <FormRow columns="grid-cols-[32rem]">
            <FormItem label="Email" error={errors?.email?.message}>
               <input
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none pb-1.5"
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
               <div className="relative flex items-center">
                  <input
                     className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2 pb-1.5 w-full"
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     autoComplete="one-time-code"
                     {...register('password', {
                        required: '*',
                        onChange: (e) => setPasswordValue(e.target.value),
                     })}
                  />
                  <AnimatePresence>
                     {passwordValue.length > 0 && (
                        <motion.button
                           type="button"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.075 }}
                           onClick={() => setShowPassword((prev) => !prev)}
                           className="absolute right-1 bottom-4 text-primary-600/50 hover:text-primary-700/70 transition cursor-pointer"
                        >
                           {showPassword ? (
                              <AiOutlineEyeInvisible className="size-8" />
                           ) : (
                              <AiOutlineEye className="size-8" />
                           )}
                        </motion.button>
                     )}
                  </AnimatePresence>
               </div>
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
