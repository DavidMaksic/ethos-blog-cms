import { HiOutlineUserCircle } from 'react-icons/hi2';
import { updateUsersTable } from '../../services/apiAuth';
import { useRef, useState } from 'react';
import { useCurrentAuthor } from './useCurrentAuthor';
import { useUpdateAuthor } from './useUpdateAuthor';
import { useAuthors } from './useAuthors';
import { LuPencil } from 'react-icons/lu';
import { useForm } from 'react-hook-form';

import TextareaAutosize from 'react-textarea-autosize';
import SubmitButton from '../../ui/Buttons/SubmitButton';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import Form from '../../ui/Forms/Form';

function EditProfileForm() {
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
      const name = full_name.trim().replace(/\s+/g, ' ');

      updateAuthor({
         full_name: name,
         description_en,
         description_srb,
         profile_image,
      });
      updateUsersTable({
         full_name: name,
         profile_image,
         description_en,
         description_srb,
         old_image,
         id,
      });
   }

   return (
      <Form isPending={isPending} onSubmit={handleSubmit(onSubmit)}>
         <FormRow columns="grid-cols-[32rem]">
            <div className="flex items-center justify-between">
               <FormItem label="Full name" error={errors?.full_name?.message}>
                  <input
                     className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none"
                     id="full_name"
                     type="text"
                     autoComplete="one-time-code"
                     defaultValue={full_name}
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
                              !/^_/.test(val) ||
                              "Can't start with an underscore",
                           endUnderscore: (val) =>
                              !/_$/.test(val) || "Can't end with an underscore",
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
                        className="block aspect-square object-cover object-center rounded-full dark:opacity-90 border border-quaternary"
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

         <FormRow columns="grid-cols-[32rem]">
            <FormItem
               label="Description (en)"
               error={errors?.description_en?.message}
            >
               <TextareaAutosize
                  minRows={3}
                  maxRows={4}
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border  font-text font-normal outline-none scrollbar text-2xl"
                  id="description_en"
                  type="text"
                  defaultValue={description_en}
                  {...register('description_en', {
                     required: '*',
                     minLength: {
                        value: 30,
                        message: 'Minimum of 30 characters',
                     },
                     maxLength: {
                        value: 300,
                        message: 'Maximum of 300 characters',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[32rem]">
            <FormItem
               label="Description (srb)"
               error={errors?.description_srb?.message}
            >
               <TextareaAutosize
                  minRows={3}
                  maxRows={4}
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border font-text font-normal outline-none scrollbar text-2xl"
                  id="description_srb"
                  type="text"
                  defaultValue={description_srb}
                  {...register('description_srb', {
                     required: '*',
                     minLength: {
                        value: 30,
                        message: 'Minimum of 30 characters',
                     },
                     maxLength: {
                        value: 300,
                        message: 'Maximum of 300 characters',
                     },
                  })}
               />
            </FormItem>
         </FormRow>

         <FormRow className="grid-cols-[auto]">
            <div className="flex justify-self-center mt-2">
               <SubmitButton isPending={isPending} loadingText="Updating">
                  Update
               </SubmitButton>
            </div>
         </FormRow>
      </Form>
   );
}

export default EditProfileForm;
