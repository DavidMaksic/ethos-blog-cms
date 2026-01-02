import { useCurrentAuthor } from './useCurrentAuthor';
import { useUpdateAuthor } from './useUpdateAuthor';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';

import PasswordButton from '../../ui/Buttons/PasswordButton';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import Form from '../../ui/Forms/Form';

function PasswordForm() {
   const { isPending, updateAuthor } = useUpdateAuthor();
   const { register, handleSubmit, formState, getValues } = useForm();
   const { errors } = formState;
   const { user } = useCurrentAuthor();

   function onSubmit({ password }) {
      updateAuthor({ password });
   }

   return (
      <div className="space-y-8">
         <Form isPending={isPending}>
            <FormRow columns="grid-cols-[24rem]">
               <FormItem label="New password" error={errors?.password?.message}>
                  <input
                     className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2"
                     id="password"
                     type="password"
                     {...register('password', {
                        required: '*',
                        minLength: {
                           value: 8,
                           message: 'Minimum 8 characters',
                        },
                        maxLength: {
                           value: 128,
                           message: 'Minimum of 128 characters',
                        },
                     })}
                  />
               </FormItem>
            </FormRow>

            <FormRow columns="grid-cols-[24rem]">
               <FormItem
                  label="Repeat password"
                  error={errors?.passwordConfirm?.message}
               >
                  <input
                     className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none mb-2"
                     id="passwordConfirm"
                     type="password"
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
               <PasswordButton
                  handler={handleSubmit(onSubmit)}
                  isPending={isPending}
                  loadingText="Changing"
               >
                  Change
               </PasswordButton>
            </FormRow>
         </Form>

         <motion.div
            className="label w-fit flex flex-col gap-3 font-creator bg-secondary dark:bg-primary-300/10 rounded-3xl text-lg text-[#4d525c] dark:text-slate-300/80 font-medium box-shadow transition-200 px-20 pr-24 pt-7 pb-10"
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
