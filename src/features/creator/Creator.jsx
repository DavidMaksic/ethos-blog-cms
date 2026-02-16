import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { CONTENT_DEBOUNCE, DEFAULT_LANG, FLAGS } from '../../utils/constants';
import { blockNoteSchema, insertAlert, toSlug } from '../../utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { LuCloudUpload, LuSunMedium } from 'react-icons/lu';
import { useCreateArticle } from '../archive/useCreateArticle';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';
import { useGetCategories } from '../tags/useGetCategories';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { HiOutlineInbox } from 'react-icons/hi';
import { useFullscreen } from '../../context/FullscreenContext';
import { BlockNoteView } from '@blocknote/mantine';
import { IoMoonOutline } from 'react-icons/io5';
import { useDarkMode } from '../../context/DarkModeContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useForm } from 'react-hook-form';
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
import { combineByGroup, filterSuggestionItems } from '@blocknote/core';
import {
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
      'article',
   );

   // - Form logic
   const { register, handleSubmit, formState, reset } = useForm();
   const { errors } = formState;

   // - Editor logic
   const [contentHTML, setContentHTML] = useState('');

   const editor = useCreateBlockNote({
      initialContent: localArticle.content,
      schema: blockNoteSchema,
      dropCursor: multiColumnDropCursor,
      dictionary: {
         ...en,
         multi_column: multiColumnLocales.en,
         placeholders: {
            ...en.placeholders,
            default: 'Write...',
         },
      },
   });

   // - Debounce article content
   const debouncedContent = useDebounce(contentHTML, CONTENT_DEBOUNCE);

   useEffect(() => {
      if (debouncedContent) {
         setLocalArticle((prev) => ({
            ...prev,
            content: editor.document,
         }));
      }
   }, [debouncedContent, setLocalArticle]); // eslint-disable-line

   const onChange = async () => {
      const html = await editor.blocksToFullHTML(editor.document);
      setContentHTML(html);
   };

   const { categories } = useGetCategories();

   // - Image select logic
   const imageRef = useRef(null);

   function handlePreviewImage(e) {
      const img = e.target.files[0];
      if (!img) return;

      const reader = new FileReader();
      reader.onloadend = () => {
         const base64 = reader.result;

         setLocalArticle((prev) => ({
            ...prev,
            image: base64,
            imageMeta: { name: img.name, type: img.type },
         }));
      };
      reader.readAsDataURL(img);
   }

   // - Submit functions
   function onSubmit(data) {
      let category_id;
      category_id = categories.find(
         (item) => item.category === localArticle?.category,
      )?.id;
      if (!category_id) category_id = categories[0].id;

      const slug = toSlug(data.title);

      createArticle(
         {
            ...data,
            image: localArticle.image,
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
         },
      );
   }

   function onSubmitDraft(data) {
      let category_id;
      category_id = categories.find(
         (item) => item.category === localArticle?.category,
      )?.id;
      if (!category_id) category_id = categories[0].id;

      const slug = toSlug(data.title);

      createArticle(
         {
            ...data,
            image: localArticle.image,
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
         },
      );
   }

   // - Reset logic
   function clear() {
      reset();
      setLocalArticle({
         title: '',
         description: '',
         image: '',
         code: 'en',
         flag: FLAGS[DEFAULT_LANG],
         content: [
            { type: 'paragraph', content: '' },
            { type: 'paragraph', content: '' },
         ],
         category: categories?.at(0).category,
      });
      document.documentElement.setAttribute('data-lang', DEFAULT_LANG);
      setTimeout(() => {
         if (editor) {
            editor.removeBlocks(editor.document);
            editor.insertBlocks([{ content: '' }], editor.document[0], 'after');
         }
      }, 1);
   }

   // - Set default article code as data-attribute
   useEffect(() => {
      document.documentElement.setAttribute('data-lang', localArticle.code);
   }, [localArticle.code]);

   // - Other
   const { user } = useCurrentAuthor();
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const { isPending, createArticle } = useCreateArticle();

   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   // - Validation logic
   function onInvalid(errors) {
      Object.entries(errors).forEach(([name, err]) => {
         if (!err?.message) return;

         const label = name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (c) => c.toUpperCase());

         const message =
            err.message === '*'
               ? `${label} is required`
               : `${label}: ${err.message}`;

         toast.error(message);
      });
   }

   return (
      <Form isPending={isPending}>
         <FormRow columns="grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Title" error={errors?.title?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border text-3xl outline-none scrollbar mt-3 text-text"
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
                  className="bg-secondary dark:bg-transparent text-3xl border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none scrollbar mt-3 text-text"
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
                        !localArticle.image &&
                        'border-2 border-dashed border-primary-300 dark:border-primary-300/60 hover:bg-primary-300/10 dark:hover:bg-primary-300/5'
                     }`}
                  >
                     <img
                        ref={imageRef}
                        src={localArticle.image || undefined}
                        className={`object-cover h-39.5 w-76 object-center rounded-3xl opacity-95 dark:opacity-85 hover:opacity-85 dark:hover:opacity-75 border border-primary-300 dark:border-quaternary transition ${
                           !localArticle.image && 'hidden'
                        }`}
                     />

                     {!localArticle.image && (
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
                        validate: () => {
                           if (!localArticle.image) return '*';
                           return true;
                        },
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
                              getMultiColumnSlashMenuItems(editor),
                           ),
                           insertAlert(
                              editor,
                              <HiOutlineInbox className="size-5 stroke-2" />,
                           ),
                        ],
                        query,
                     )
                  }
               />
            </BlockNoteView>
         </FormItem>

         <input
            type="hidden"
            {...register('content', {
               validate: () => {
                  if (!editor.document[0]?.content) {
                     return '*';
                  }
                  return true;
               },
            })}
            value={contentHTML}
         />

         <div className="flex justify-center items-center gap-8">
            <SubmitButton
               handler={handleSubmit(onSubmit, onInvalid)}
               isPending={isPending}
               loadingText="Publishing"
            >
               Publish
            </SubmitButton>
            <span className="italic text-4xl text-primary-400">or</span>
            <DraftButton
               handler={handleSubmit(onSubmitDraft, onInvalid)}
               isPending={isPending}
            />
         </div>

         <LanguageButton
            localArticle={localArticle}
            setLocalArticle={setLocalArticle}
         />

         <Options editor={editor} currentAuthor={user}>
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
