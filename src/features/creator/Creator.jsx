/* eslint-disable no-unused-vars */
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { LuCloudUpload, LuSunMedium } from 'react-icons/lu';
import { insertAlert, toSlug } from '../../utils/helpers';
import { DEFAULT_LANG, FLAGS } from '../../utils/constants';
import { useCreateArticle } from '../archive/useCreateArticle';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';
import { useGetCategories } from '../tags/useGetCategories';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { HiOutlineInbox } from 'react-icons/hi';
import { useFullscreen } from '../../context/FullscreenContext';
import { BlockNoteView } from '@blocknote/mantine';
import { IoMoonOutline } from 'react-icons/io5';
import { useDarkMode } from '../../context/DarkModeContext';
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
import Categories from '../../ui/Categories';
import FormItem from '../../ui/Forms/FormItem';
import FormRow from '../../ui/Forms/FormRow';
import Options from '../../ui/Operations/Options';
import toast from 'react-hot-toast';
import Form from '../../ui/Forms/Form';

function Creator() {
   const [localArticle, setLocalArticle] = useLocalStorage(
      {
         title: '',
         description: '',
         content: [
            { type: 'paragraph', content: '' },
            { type: 'paragraph', content: '' },
         ],
         code: DEFAULT_LANG,
      },
      'article'
   );

   useEffect(() => {
      document.documentElement.setAttribute('data-lang', localArticle.code);
   }, []); // eslint-disable-line

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
   const [currentImage, setCurrentImage] = useState(localArticle.image || null);

   // - Reset logic
   function clear() {
      setLocalArticle({
         title: '',
         description: '',
         code: 'en',
         flag: FLAGS[DEFAULT_LANG],
         content: [
            { type: 'paragraph', content: '' },
            { type: 'paragraph', content: '' },
         ],
         category: categories?.at(0).category,
      });
      setCurrentImage('');
      document.documentElement.setAttribute('data-lang', DEFAULT_LANG);
      setTimeout(() => {
         if (editor) {
            editor.removeBlocks(editor.document);
            editor.insertBlocks([{ content: '' }], editor.document[0], 'after');
         }
      }, 1);
   }

   // - Form logic
   const { register, handleSubmit, formState } = useForm();
   const { errors } = formState;

   // - Other
   const { user } = useCurrentAuthor();
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const { isPending, createArticle } = useCreateArticle();

   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   // - Submit functions
   function onSubmit(data) {
      let category_id;
      category_id = categories.find(
         (item) => item.category === localArticle?.category
      )?.id;
      if (!category_id) category_id = categories[0].id;

      if (!currentImage) {
         toast.error("Image doesn't exist!");
         throw new Error("Image doesn't exist!");
      }

      const slug = toSlug(data.title);

      createArticle(
         {
            ...data,
            image: currentImage,
            category_id,
            status: 'published',
            author_id: user.id,
            content: contentHTML,
            featured: false,
            main_feature: false,
            code: localArticle.code,
            slug,
         },
         {
            onSuccess: clear,
         }
      );
   }

   function onSubmitDraft(data) {
      let category_id;
      category_id = categories.find(
         (item) => item.category === localArticle?.category
      )?.id;
      if (!category_id) category_id = categories[0].id;

      if (!currentImage) {
         toast.error("Image doesn't exist!");
         throw new Error("Image doesn't exist!");
      }

      const slug = toSlug(data.title);

      createArticle(
         {
            ...data,
            image: currentImage,
            category_id,
            status: 'drafted',
            author_id: user.id,
            content: contentHTML,
            featured: false,
            main_feature: false,
            code: localArticle.code,
            slug,
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
      if (!img) return;
      setCurrentImage(img);

      if (imageRef?.current) {
         imageRef.current.src = URL.createObjectURL(img);
         imageRef.current.srcset = URL.createObjectURL(img);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
         const base64String = reader.result;
         setLocalArticle({
            ...localArticle,
            image: base64String,
         });
      };
      reader.readAsDataURL(img);
   }

   return (
      <Form isPending={isPending}>
         <FormRow columns="grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Title" error={errors?.title?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border text-3xl outline-none scrollbar mt-3"
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
               <Categories
                  setLocalItem={setLocalArticle}
                  localItem={localArticle}
               >
                  {!localArticle.category
                     ? categories?.at(0).category
                     : localArticle.category}
               </Categories>
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Description" error={errors?.description?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-transparent text-3xl border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none scrollbar mt-3"
                  minRows={4}
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
               <label htmlFor="image" className="w-fit rounded-3xl">
                  <div
                     className={`relative h-39.5 w-76 rounded-3xl cursor-pointer transition ${
                        !currentImage &&
                        'border-2 border-dashed border-primary-300 dark:border-primary-300/60 hover:bg-primary-300/10 dark:hover:bg-primary-300/5'
                     }`}
                  >
                     <img
                        ref={imageRef}
                        src={currentImage || undefined}
                        className={`object-cover h-39.5 w-76 object-center rounded-3xl opacity-95 dark:opacity-85 hover:opacity-85 dark:hover:opacity-75 border border-primary-300 dark:border-quaternary transition ${
                           !currentImage && 'hidden'
                        }`}
                     />

                     {!currentImage && (
                        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-0.5">
                           <LuCloudUpload className="size-8" />
                           <span className="normal-case text-xl select-none">
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

         <FormItem label="Content">
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
            localArticle={localArticle}
            setLocalArticle={setLocalArticle}
         />

         <Options isEdit={true} currentAuthor={user}>
            <button
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 mt-0.5 rounded-2xl transition"
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

            <button
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 transition mt-0.5 rounded-2xl"
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
         </Options>

         <ClearButton handler={clear} style="right-23" />
      </Form>
   );
}

export default Creator;
