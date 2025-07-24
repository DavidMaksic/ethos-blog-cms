import { useCurrentAuthor } from './useCurrentAuthor';
import { useUpdateAuthor } from './useUpdateAuthor';
import { useForm } from 'react-hook-form';

import PasswordButton from '../../ui/Buttons/PasswordButton';
import FormItem from '../../ui/Form/FormItem';
import FormRow from '../../ui/Form/FormRow';
import Form from '../../ui/Form/Form';

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
         <Form isPending={isPending} hasMargin={false}>
            <FormRow columns="grid-cols-[24rem] xl:grid-cols-[20rem]">
               <FormItem label="New password" error={errors?.password?.message}>
                  <input
                     className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none mb-2"
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

            <FormRow columns="grid-cols-[24rem] xl:grid-cols-[20rem]">
               <FormItem
                  label="Repeat password"
                  error={errors?.passwordConfirm?.message}
               >
                  <input
                     className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none mb-2"
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

         <div className="label w-fit flex flex-col gap-3 font-creator bg-secondary dark:bg-primary-200 rounded-3xl text-lg text-[#4d525c] dark:text-slate-300/80 font-medium box-shadow transition-200 px-20 xl:px-14 pr-24 xl:pr-16 pt-7 xl:pt-6 pb-10 xl:pb-9">
            <label>Email</label>
            <span className="text-2xl">{user.email}</span>
         </div>
      </div>
   );
}

export default PasswordForm;
