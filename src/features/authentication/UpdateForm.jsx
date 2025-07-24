import { HiOutlineUserCircle } from 'react-icons/hi2';
import { updateUsersTable } from '../../services/apiAuth';
import { useRef, useState } from 'react';
import { useCurrentAuthor } from './useCurrentAuthor';
import { useUpdateAuthor } from './useUpdateAuthor';
import { useAuthors } from '../authentication/useAuthors';
import { LuPencil } from 'react-icons/lu';
import { useForm } from 'react-hook-form';

import TextareaAutosize from 'react-textarea-autosize';
import SubmitButton from '../../ui/Buttons/SubmitButton';
import FormItem from '../../ui/Form/FormItem';
import FormRow from '../../ui/Form/FormRow';
import Form from '../../ui/Form/Form';

function UpdateForm() {
   const { user: currentAuthor } = useCurrentAuthor();
   const { isPending, updateAuthor } = useUpdateAuthor();
   const { register, handleSubmit, formState } = useForm();
   const { errors } = formState;

   const {
      id,
      email,
      user_metadata: { full_name },
   } = currentAuthor;

   // Find old profile_image
   const { authors } = useAuthors();
   const theAuthor = authors?.filter((item) => item.email === email);
   const { profile_image, description_en, description_srb } = theAuthor[0];

   const imageRef = useRef(null);
   const [currentImage, setCurrentImage] = useState();

   function handlePreviewImage(e) {
      const img = e.target.files[0];
      setCurrentImage(img);

      setTimeout(() => {
         if (imageRef.current) {
            imageRef.current.src = URL.createObjectURL(img);
            imageRef.current.srcset = URL.createObjectURL(img);
         }
      }, 1);
   }

   if (theAuthor === undefined) return <div>Loading...</div>;

   const old_image = profile_image?.slice(81);

   function onSubmit({ full_name, description_en, description_srb }) {
      const profile_image = currentImage;

      updateAuthor({
         full_name,
         description_en,
         description_srb,
         profile_image,
      });
      updateUsersTable({
         full_name,
         profile_image,
         description_en,
         description_srb,
         old_image,
         id,
      });
   }

   return (
      <Form isPending={isPending}>
         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[28rem]">
            <div className="flex items-center justify-between">
               <FormItem label="Full name" error={errors?.full_name?.message}>
                  <input
                     className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none"
                     id="full_name"
                     type="text"
                     autoComplete="one-time-code"
                     defaultValue={full_name}
                     {...register('full_name', {
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

               <label
                  className="relative size-30 hover:opacity-80 cursor-pointer transition-[opacity_0.2s]"
                  htmlFor="image"
               >
                  {currentImage || profile_image ? (
                     <img
                        className="block aspect-square object-cover object-center rounded-full opacity-80 dark:opacity-75 border border-quaternary"
                        src={profile_image}
                        ref={imageRef}
                        alt="User profile image"
                     />
                  ) : (
                     <HiOutlineUserCircle className="size-33 stroke-[0.3px] text-primary-400/70 dark:text-primary-300" />
                  )}

                  <input
                     hidden
                     id="image"
                     accept="image/*"
                     type="file"
                     onChange={handlePreviewImage}
                  />

                  <LuPencil className="absolute right-0 bottom-0 size-8 px-[0.4rem] pt-px rounded-full text-primary-500/80 dark:text-primary-400 bg-white dark:bg-primary-200 border border-primary-300 dark:border-quaternary transition-200" />
               </label>
            </div>
         </FormRow>

         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[28rem]">
            <FormItem
               label="Description (en)"
               error={errors?.description_en?.message}
            >
               <TextareaAutosize
                  minRows={2}
                  maxRows={3}
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none scrollbar text-2xl"
                  id="description_en"
                  type="text"
                  defaultValue={description_en}
                  {...register('description_en', {
                     minLength: {
                        value: 30,
                        message: 'Minimum of 30 characters',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[32rem] xl:grid-cols-[28rem]">
            <FormItem
               label="Description (srb)"
               error={errors?.description_srb?.message}
            >
               <TextareaAutosize
                  minRows={2}
                  maxRows={3}
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none scrollbar text-2xl"
                  id="description_srb"
                  type="text"
                  defaultValue={description_srb}
                  {...register('description_srb', {
                     minLength: {
                        value: 30,
                        message: 'Minimum of 30 characters',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow className="grid-cols-[auto]">
            <div className="flex justify-self-center mt-6">
               <SubmitButton
                  isPending={isPending}
                  loadingText="Updating"
                  handler={handleSubmit(onSubmit)}
               >
                  Update
               </SubmitButton>
            </div>
         </FormRow>
      </Form>
   );
}

export default UpdateForm;
