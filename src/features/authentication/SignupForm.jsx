import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion, AnimatePresence } from 'motion/react';
import { useSignup } from './useSignup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import SubmitButton from '../../ui/Buttons/SubmitButton';
import ClearButton from '../../ui/Buttons/ClearButton';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import toast from 'react-hot-toast';
import Form from '../../ui/Forms/Form';

function SignupForm() {
   const { isPending, isSuccess, signup } = useSignup();
   const { register, handleSubmit, formState, reset, watch } = useForm();
   const { errors } = formState;

   const [showPassword, setShowPassword] = useState(false);

   const passwordValue = watch('password', '');

   function onSubmit({ full_name, email, password }) {
      signup(
         {
            full_name,
            email,
            password,
         },
         {
            onSettled: () => {
               toast.success('Account successfully created!');
               resetInputs();
            },
         },
      );
   }

   function resetInputs() {
      setShowPassword(false);
      reset({
         full_name: '',
         email: '',
         password: '',
      });
   }

   return (
      <Form isPending={isPending} onSubmit={handleSubmit(onSubmit)}>
         <FormRow columns="grid-cols-[32rem]">
            <FormItem label="Name" error={errors?.full_name?.message}>
               <input
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none pb-1.5"
                  id="full_name"
                  type="text"
                  autoComplete="one-time-code"
                  {...register('full_name', {
                     required: '*',
                     minLength: {
                        value: 2,
                        message: 'Minimum of 2 characters',
                     },
                     maxLength: {
                        value: 25,
                        message: 'Maximum of 25 characters',
                     },
                     validate: {
                        allNumbers: (val) =>
                           !/^\d+$/.test(val) ||
                           'The username must contain letters',
                        consecutiveUnderscores: (val) =>
                           !/__/.test(val) || 'No consecutive underscores',
                        startUnderscore: (val) =>
                           !/^_/.test(val) || "Can't start with an underscore",
                        endUnderscore: (val) =>
                           !/_$/.test(val) || "Can't end with an underscore",
                     },
                  })}
               />
            </FormItem>
         </FormRow>

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

         <FormRow columns="grid-cols-[32rem]">
            <FormItem label="Password" error={errors?.password?.message}>
               <div className="relative flex items-center">
                  <input
                     className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2 pb-1.5 w-full"
                     id="password"
                     type={showPassword ? 'text' : 'password'}
                     autoComplete="one-time-code"
                     {...register('password', {
                        required: '*',
                        minLength: {
                           value: 8,
                           message: 'Minimum of 8 characters',
                        },
                        maxLength: {
                           value: 128,
                           message: 'Maximum of 128 characters',
                        },
                        validate: (val) =>
                           /[0-9]/.test(val) ||
                           'Must contain at least one number',
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
               <SubmitButton
                  isPending={isPending}
                  isSuccess={isSuccess}
                  loadingText="Signing up"
               >
                  Sign Up
               </SubmitButton>
            </div>
         </FormRow>

         <ClearButton handler={resetInputs} style="right-7" />
      </Form>
   );
}

export default SignupForm;
