/* eslint-disable no-unused-vars */
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { LuCloudUpload, LuSunMedium } from 'react-icons/lu';
import { useGetCategories } from '../tags/useGetCategories';
import { useCreateArticle } from '../archive/useCreateArticle';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { HiOutlineInbox } from 'react-icons/hi';
import { useFullscreen } from '../../context/FullscreenContext';
import { BlockNoteView } from '@blocknote/mantine';
import { IoMoonOutline } from 'react-icons/io5';
import { useDarkMode } from '../../context/DarkModeContext';
import { insertAlert } from '../../utils/helpers';
import { FiChevronUp } from 'react-icons/fi';
import { useScroll } from '../../hooks/useScroll';
import { useForm } from 'react-hook-form';
import { Alert } from '../../ui/Alert';
import { en } from '../../../node_modules/@blocknote/core/src/i18n/locales/en';

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import {
   getDefaultReactSlashMenuItems,
   FormattingToolbarController,
   SuggestionMenuController,
   blockTypeSelectItems,
   useCreateBlockNote,
   FormattingToolbar,
} from '@blocknote/react';
import {
   BlockNoteSchema,
   combineByGroup,
   defaultBlockSpecs,
   filterSuggestionItems,
} from '@blocknote/core';
import {
   withMultiColumn,
   multiColumnDropCursor,
   getMultiColumnSlashMenuItems,
   locales as multiColumnLocales,
} from '@blocknote/xl-multi-column';

import TextareaAutosize from 'react-textarea-autosize';
import LanguageButton from '../../ui/Buttons/LanguageButton';
import SubmitButton from '../../ui/Buttons/SubmitButton';
import ClearButton from '../../ui/Buttons/ClearButton';
import DraftButton from '../../ui/Buttons/DraftButton';
import srbFlag from '../../../public/assets/srb-flag.png';
import FormItem from '../../ui/Form/FormItem';
import FormRow from '../../ui/Form/FormRow';
import Context from '../../ui/Context';
import Options from '../../ui/Options';
import toast from 'react-hot-toast';
import Form from '../../ui/Form/Form';

function Creator() {
   const [localArticle, setLocalArticle] = useLocalStorage(
      {
         title: '',
         description: '',
         content: '',
         language: 'Српски',
         flag: srbFlag,
      },
      'article'
   );

   useEffect(() => {
      document.documentElement.setAttribute('data-lang', localArticle.language);
   }, [localArticle]);

   // - Editor logic
   const [contentHTML, setContentHTML] = useState('');

   const {
      file,
      audio,
      emoji,
      checkListItem,
      codeBlock,
      table,
      ...remainingBlockSpecs
   } = defaultBlockSpecs;

   const schema = withMultiColumn(
      BlockNoteSchema.create({
         blockSpecs: {
            ...remainingBlockSpecs,
            alert: Alert,
         },
      })
   );

   const locale = en;

   const editor = useCreateBlockNote({
      initialContent: localArticle.content,
      schema,
      dropCursor: multiColumnDropCursor,
      dictionary: {
         ...locale,
         multi_column: multiColumnLocales.en,
         placeholders: {
            ...locale.placeholders,
            default: 'Write...',
         },
      },
   });

   const onChange = async () => {
      const html = await editor.blocksToFullHTML(editor.document);

      setContentHTML(html);
      setLocalArticle({
         ...localArticle,
         content: editor.document,
      });
   };

   const { categories } = useGetCategories();
   const [currentImage, setCurrentImage] = useState();

   // - Reset logic
   function clear() {
      setLocalArticle({
         title: '',
         description: '',
         language: 'Српски',
         content: '',
         category: categories?.at(0).category,
      });
      setCurrentImage('');
   }

   // - Form logic
   const { register, handleSubmit, formState } = useForm();
   const { errors } = formState;

   // - Scroll logic
   const { setScroll, ref: topRef } = useScroll();
   const { setScroll: setBottomScroll, ref: bottomRef } = useScroll();

   // - Other
   const { user } = useCurrentAuthor();
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const { isPending, createArticle } = useCreateArticle();

   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   // - Submit functions
   function onSubmit(data) {
      let categoryID;
      categoryID = categories.find(
         (item) => item.category === localArticle?.category
      )?.id;
      if (!categoryID) categoryID = categories[0].id;

      if (!currentImage) {
         toast.error("Image doesn't exist!");
         throw new Error("Image doesn't exist!");
      }

      createArticle(
         {
            ...data,
            image: currentImage,
            categoryID,
            status: 'published',
            author_id: user.id,
            content: contentHTML,
            featured: false,
            language: localArticle.language,
            flag: localArticle.flag,
         },
         {
            onSuccess: clear,
         }
      );
   }

   function onSubmitDraft(data) {
      let categoryID;
      categoryID = categories.find(
         (item) => item.category === localArticle?.category
      )?.id;
      if (!categoryID) categoryID = categories[0].id;

      if (!currentImage) {
         toast.error("Image doesn't exist!");
         throw new Error("Image doesn't exist!");
      }

      createArticle(
         {
            ...data,
            image: currentImage,
            categoryID,
            status: 'drafted',
            author_id: user.id,
            content: contentHTML,
            featured: false,
            language: localArticle.language,
            flag: localArticle.flag,
         },
         {
            onSuccess: clear,
         }
      );
   }

   // Upload image logic
   const imageRef = useRef(null);

   function handlePreviewImage(e) {
      const img = e.target.files[0];
      setCurrentImage(img);

      if (imageRef?.current) {
         imageRef.current.src = URL.createObjectURL(img);
         imageRef.current.srcset = URL.createObjectURL(img);
      }
   }

   return (
      <Form isPending={isPending}>
         <FormRow columns="grid-cols-[40rem_1fr] xl:grid-cols-[38rem_1fr]">
            <FormItem label="Title" error={errors?.title?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border text-3xl outline-none scrollbar mt-3"
                  minRows={1}
                  maxRows={2}
                  id="title"
                  type="text"
                  autoComplete="one-time-code"
                  value={localArticle.title}
                  {...register('title', {
                     required: '*',
                     minLength: {
                        value: 5,
                        message: 'Minimum of 5 characters',
                     },
                     maxLength: {
                        value: 86,
                        message: 'Maximum of 86 characters',
                     },
                     onChange: (e) => {
                        setLocalArticle({
                           ...localArticle,
                           title: e.target.value,
                        });
                     },
                  })}
               />
            </FormItem>

            <FormItem label="Category" error={errors?.category?.message}>
               <Context setLocalItem={setLocalArticle} localItem={localArticle}>
                  {!localArticle.category
                     ? categories?.at(0).category
                     : localArticle.category}
               </Context>
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[40rem_1fr] xl:grid-cols-[38rem_1fr]">
            <FormItem label="Description" error={errors?.description?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-primary-200 text-3xl border-b border-b-quaternary transition-bg_border outline-none scrollbar mt-3"
                  minRows={3}
                  maxRows={4}
                  id="description"
                  type="text"
                  autoComplete="one-time-code"
                  value={localArticle.description}
                  {...register('description', {
                     required: '*',
                     minLength: {
                        value: 20,
                        message: 'Minimum of 20 characters',
                     },
                     maxLength: {
                        value: 152,
                        message: 'Maximum of 152 characters',
                     },
                     onChange: (e) => {
                        setLocalArticle({
                           ...localArticle,
                           description: e.target.value,
                        });
                     },
                  })}
               />
            </FormItem>

            <FormItem label="Image" error={errors?.image?.message}>
               <label htmlFor="image">
                  <div
                     className={`relative h-31 w-60 rounded-3xl cursor-pointer ${
                        !currentImage &&
                        'border-2 border-dashed border-primary-300 dark:border-primary-300/60 transition-[border]'
                     }`}
                  >
                     <img
                        ref={imageRef}
                        className={`object-cover h-31 w-60 object-center rounded-3xl dark:opacity-90 border border-primary-300 dark:border-quaternary transition-border ${
                           !currentImage && 'hidden'
                        }`}
                     />

                     {!currentImage && (
                        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-0.5">
                           <LuCloudUpload className="size-8" />
                           <span className="normal-case text-xl">
                              Upload image
                           </span>
                        </div>
                     )}
                  </div>

                  <input
                     hidden
                     id="image"
                     accept="image/*"
                     type="file"
                     {...register('image', {
                        required: '*',
                     })}
                     onChange={handlePreviewImage}
                  />
               </label>
            </FormItem>
         </FormRow>

         <FormItem label="Content" language={localArticle.language}>
            <BlockNoteView
               editor={editor}
               onChange={onChange}
               slashMenu={false}
               formattingToolbar={false}
               data-theming-css-variables
            >
               <FormattingToolbarController
                  formattingToolbar={() => (
                     <FormattingToolbar
                        blockTypeSelectItems={[
                           ...blockTypeSelectItems(editor.dictionary),
                           {
                              name: 'Box',
                              type: 'alert',
                              icon: HiOutlineInbox,
                              isSelected: (block) => block.type === 'alert',
                           },
                        ]}
                     />
                  )}
               />
               <SuggestionMenuController
                  triggerCharacter={'/'}
                  getItems={async (query) =>
                     filterSuggestionItems(
                        [
                           ...combineByGroup(
                              getDefaultReactSlashMenuItems(editor),
                              getMultiColumnSlashMenuItems(editor)
                           ),
                           insertAlert(
                              editor,
                              <HiOutlineInbox className="size-5 stroke-2" />
                           ),
                        ],
                        query
                     )
                  }
               />
            </BlockNoteView>
         </FormItem>

         <div className="flex justify-center items-center gap-8">
            <SubmitButton
               handler={handleSubmit(onSubmit)}
               isPending={isPending}
               loadingText="Publishing"
            >
               Publish
            </SubmitButton>
            <span className="italic text-4xl text-primary-400">or</span>
            <DraftButton
               handler={handleSubmit(onSubmitDraft)}
               isPending={isPending}
            />
         </div>

         <LanguageButton
            localItem={localArticle}
            setLocalItem={setLocalArticle}
         />

         <div className="absolute top-[-200px] left-0" ref={topRef} />
         <div className="absolute bottom-0 left-0" ref={bottomRef} />

         <Options setBottomScroll={setBottomScroll} isEdit={true}>
            <FiChevronUp
               className="py-3 size-13.5 stroke-[1.8px] hover:bg-white dark:hover:bg-primary-200 rounded-t-[20px] mt-1 rounded-2xl"
               onClick={() => setScroll(true)}
            />

            <button
               className=" hover:bg-white dark:hover:bg-primary-200 transition-bg mt-0.5 rounded-2xl"
               onClick={(e) => {
                  e.stopPropagation();
                  toggleDarkMode((isOpen) => !isOpen);
               }}
            >
               {isDarkMode ? (
                  <IoMoonOutline className="py-1 px-3.5 size-13.5" />
               ) : (
                  <LuSunMedium className="py-1 px-3.5 size-13.5" />
               )}
            </button>

            <button
               className="hover:bg-white dark:hover:bg-primary-200 mt-0.5 rounded-2xl"
               onClick={(e) => {
                  e.stopPropagation();
                  setLocalFullscreen((isOpen) => !isOpen);
                  setIsFullscreen((isOpen) => !isOpen);
               }}
            >
               {!isFullscreen ? (
                  <AiOutlineFullscreen className="py-1 pb-1.5 px-3.5 size-13.5" />
               ) : (
                  <AiOutlineFullscreenExit className="py-1 pb-1.5 px-3.5 size-13.5" />
               )}
            </button>
         </Options>

         <ClearButton handler={clear} editor={editor} style="right-23" />
      </Form>
   );
}

export default Creator;
