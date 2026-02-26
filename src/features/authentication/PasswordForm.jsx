import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentAuthor } from './useCurrentAuthor';
import { useUpdateAuthor } from './useUpdateAuthor';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import PasswordButton from '../../ui/Buttons/PasswordButton';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import Form from '../../ui/Forms/Form';

function PasswordForm() {
   const { isPending, updateAuthor } = useUpdateAuthor();
   const { register, handleSubmit, formState, getValues, watch } = useForm();
   const { errors } = formState;
   const { user } = useCurrentAuthor();

   const [showPassword, setShowPassword] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);

   const passwordValue = watch('password', '');
   const confirmValue = watch('passwordConfirm', '');

   function onSubmit({ password }) {
      updateAuthor({ password });
   }

   return (
      <div className="space-y-8">
         <Form isPending={isPending} onSubmit={handleSubmit(onSubmit)}>
            <FormRow columns="grid-cols-[24rem]">
               <FormItem label="New password" error={errors?.password?.message}>
                  <div className="relative flex items-center">
                     <input
                        className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2 pb-0.5 w-full"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                           required: '*',
                           minLength: {
                              value: 8,
                              message: 'Minimum 8 characters',
                           },
                           maxLength: {
                              value: 128,
                              message: 'Maximum of 128 characters',
                           },
                           validate: (value) =>
                              /[0-9]/.test(value) ||
                              'Must have at least one number',
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

            <FormRow columns="grid-cols-[24rem]">
               <FormItem
                  label="Confirm password"
                  error={errors?.passwordConfirm?.message}
               >
                  <div className="relative flex items-center">
                     <input
                        className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2 pb-0.5 w-full"
                        id="passwordConfirm"
                        type={showConfirm ? 'text' : 'password'}
                        {...register('passwordConfirm', {
                           required: '*',
                           validate: (value) =>
                              value === getValues().password ||
                              'Passwords need to match',
                        })}
                     />
                     <AnimatePresence>
                        {confirmValue.length > 0 && (
                           <motion.button
                              type="button"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.075 }}
                              onClick={() => setShowConfirm((prev) => !prev)}
                              className="absolute right-1 bottom-4 text-primary-600/50 hover:text-primary-700/70 transition cursor-pointer"
                           >
                              {showConfirm ? (
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
               <PasswordButton isPending={isPending} loadingText="Changing">
                  Change
               </PasswordButton>
            </FormRow>
         </Form>

         <motion.div
            className="label w-fit flex flex-col gap-3 font-creator bg-secondary dark:bg-primary-300/10 rounded-3xl text-lg text-primary-600 dark:text-slate-300/80 font-medium box-shadow transition-200 px-20 pr-24 pt-7 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
         >
            <label>Email</label>
            <span className="text-2xl">{user.email}</span>
         </motion.div>
      </div>
   );
}

export default PasswordForm;
