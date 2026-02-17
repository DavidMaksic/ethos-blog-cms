import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { blockNoteSchema, insertAlert, toSlug } from '../../utils/helpers';
import { CONTENT_DEBOUNCE, LANGUAGES } from '../../utils/constants';
import { useEffect, useRef, useState, useMemo } from 'react';
import { LuSave, LuSunMedium } from 'react-icons/lu';
import { useGetCategories } from '../../features/tags/useGetCategories';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEditArticle } from '../../features/archive/useEditArticle';
import { useFindArticle } from '../../features/archive/useFindArticle';
import { HiOutlineInbox } from 'react-icons/hi';
import { useFullscreen } from '../../context/FullscreenContext';
import { BlockNoteView } from '@blocknote/mantine';
import { IoMoonOutline } from 'react-icons/io5';
import { useUnFeature } from '../../features/archive/useUnFeature';
import { useDarkMode } from '../../context/DarkModeContext';
import { useDebounce } from '../../hooks/useDebounce';
import { ImSpinner2 } from 'react-icons/im';
import { useForm } from 'react-hook-form';
import { en } from '../../../node_modules/@blocknote/core/src/i18n/locales/en';

import {
   getDefaultReactSlashMenuItems,
   FormattingToolbarController,
   SuggestionMenuController,
   blockTypeSelectItems,
   FormattingToolbar,
} from '@blocknote/react';
import {
   combineByGroup,
   filterSuggestionItems,
   BlockNoteEditor,
} from '@blocknote/core';
import {
   multiColumnDropCursor,
   getMultiColumnSlashMenuItems,
   locales as multiColumnLocales,
} from '@blocknote/xl-multi-column';

import TextareaAutosize from 'react-textarea-autosize';
import LanguageButton from '../Buttons/LanguageButton';
import EditSkeleton from '../Skeletons/EditSkeleton';
import SubmitButton from '../Buttons/SubmitButton';
import ResetButton from '../Buttons/ResetButton';
import Categories from '../Categories';
import FormStatus from './FormStatus';
import FormItem from './FormItem';
import Options from '../Operations/Options';
import FormRow from './FormRow';
import toast from 'react-hot-toast';
import Form from './Form';

function EditArticleForm() {
   const { article, isPending } = useFindArticle();
   const oldImage = article.image;

   // - Category logic
   const { categories } = useGetCategories();
   const category = article?.categories;

   // - LocalStorage logic
   const [localArticle, setLocalArticle] = useLocalStorage(
      {
         ...article,
         category: category?.category,
      },
      'editArticle',
   );

   // - Set default article code as data-attribute
   useEffect(() => {
      document.documentElement.setAttribute('data-lang', localArticle.code);
   }, [localArticle.code]);

   // - Status logic
   const articleStatus =
      article.status.charAt(0).toUpperCase() + article.status.slice(1);
   const [currentStatus, setCurrentStatus] = useState(articleStatus);

   // - Form logic
   const { register, handleSubmit, formState, reset, watch } = useForm({
      defaultValues: localArticle,
   });
   const { errors } = formState;

   useEffect(() => {
      const subscription = watch((value) => {
         setLocalArticle((prev) => ({
            ...prev,
            ...value,
         }));
      });

      return () => subscription.unsubscribe();
   }, [watch, setLocalArticle]);

   // - Other
   const [isDefault, setIsDefault] = useState(true);
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const { user } = useCurrentAuthor();

   // - Load initial content asynchronously
   const [initialContent, setInitialContent] = useState('loading');
   const hasLoadedRef = useRef(false);

   useEffect(() => {
      const loadInitialBlocks = async () => {
         const html =
            article?.id && article.id !== localArticle.id
               ? article.content
               : localArticle.content;

         // Create a temporary editor just to parse HTML
         const tempEditor = BlockNoteEditor.create({
            schema: blockNoteSchema,
         });

         const blocks = await tempEditor.tryParseHTMLToBlocks(html);
         setInitialContent(blocks);
      };

      if (hasLoadedRef.current) return;
      hasLoadedRef.current = true;

      loadInitialBlocks();
   }, []); // eslint-disable-line

   // - Editor logic with useMemo
   const editor = useMemo(() => {
      if (initialContent === 'loading') {
         return undefined;
      }

      return BlockNoteEditor.create({
         initialContent,
         trailingBlock: false,
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
   }, [initialContent]);

   // - Debounce article content
   const [contentHTML, setContentHTML] = useState();
   const debouncedContent = useDebounce(contentHTML, CONTENT_DEBOUNCE);
   useEffect(() => {
      if (debouncedContent) {
         setLocalArticle((prev) => ({
            ...prev,
            content: debouncedContent,
         }));
      }
   }, [debouncedContent, setLocalArticle]);

   // - When article content changes, store it as html
   const onChange = async () => {
      if (!editor) return;
      const html = await editor.blocksToFullHTML(editor.document);
      setContentHTML(html);
   };

   // - Sync between inputs and localStorage
   useEffect(() => {
      // - Check if the API article differs from one in storage
      if (article?.id && article.id !== localArticle.id) {
         const freshArticle = {
            ...article,
            category: article.categories?.category,
         };

         setLocalArticle(freshArticle);
         reset(freshArticle);
      }
   }, [article, reset, localArticle.id, setLocalArticle]);

   const [currentImage, setCurrentImage] = useState();
   useEffect(() => {
      setCurrentImage(localArticle?.image || oldImage);
   }, [localArticle?.image, oldImage]);

   // - Fullscreen and scroll logic
   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   useEffect(() => {
      if (editor) {
         // - Set fullscreen by default when editor loads
         setLocalFullscreen(true);
         setIsFullscreen(true);

         // - Restore scroll position
         requestAnimationFrame(() => {
            requestAnimationFrame(() => {
               const container = document.querySelector('main');
               const savedScrollY = sessionStorage.getItem('articleScrollY');
               if (container && savedScrollY) {
                  const scrollPosition = Number(savedScrollY) - 110;
                  container.scrollTo({ top: scrollPosition, behavior: 'auto' });
                  sessionStorage.removeItem('articleScrollY');
               }
            });
         });
      }
   }, [editor]); // eslint-disable-line

   // - React Query logic
   const { isUnFeaturing, unFeature } = useUnFeature();
   const { isEditing, editArticle } = useEditArticle();

   function onSubmit(data) {
      const { id: category_id } = categories.find(
         (item) => item.category === localArticle.category,
      );

      editArticle(
         {
            ...data,
            image: localArticle.image,
            oldImage,
            content: contentHTML,
            category_id,
            status:
               currentStatus.charAt(0).toLowerCase() + currentStatus.slice(1),
            code: localArticle.code,
            slug: toSlug(data.title),
            oldArticle: article,
         },
         {
            onSuccess: () => {
               localStorage.removeItem('editArticle');
            },
         },
      );

      if (
         currentStatus !== articleStatus ||
         category.category !== localArticle.category
      ) {
         unFeature({
            id: article.id,
            featured: false,
            main_feature: false,
         });
      }
   }

   // Upload image logic
   const imageRef = useRef(null);

   function handlePreviewImage(e) {
      const img = e.target.files[0];
      if (!img) return;

      const reader = new FileReader();
      reader.onloadend = () => {
         const base64 = reader.result;

         setCurrentImage(base64);
         setLocalArticle((prev) => ({
            ...prev,
            image: base64,
            imageMeta: { name: img.name, type: img.type },
         }));
      };
      reader.readAsDataURL(img);
   }

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

   const isLoading = isPending || isEditing || isUnFeaturing;

   if (!editor) {
      return <EditSkeleton isForm={true} />;
   }

   return (
      <Form isPending={isLoading}>
         <FormRow columns="grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Title" error={errors?.title?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary transition-bg_border text-3xl outline-none scrollbar mt-3 text-text"
                  minRows={1}
                  maxRows={2}
                  id="title"
                  type="text"
                  autoComplete="one-time-code"
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
                  })}
               />
            </FormItem>

            <FormItem label="Category" error={errors?.category?.message}>
               <Categories
                  localItem={localArticle}
                  setLocalItem={setLocalArticle}
                  article={article}
                  isDefault={isDefault}
                  setIsDefault={setIsDefault}
               >
                  {category ? (
                     isDefault ? (
                        category?.category
                     ) : (
                        localArticle.category
                     )
                  ) : (
                     <ImSpinner2 className="size-6 animate-spin self-center mx-5 ml-7 my-1" />
                  )}
               </Categories>
            </FormItem>
         </FormRow>

         <FormRow columns="grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Description" error={errors?.description?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-transparent text-3xl border-b border-b-quaternary transition-bg_border outline-none scrollbar mt-3 text-text"
                  minRows={4}
                  maxRows={4}
                  id="description"
                  type="text"
                  autoComplete="one-time-code"
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
                  })}
               />
            </FormItem>

            <FormItem label="Image" error={errors?.image?.message}>
               <label htmlFor="image" className="w-fit rounded-3xl">
                  <img
                     ref={imageRef}
                     src={currentImage}
                     className="object-cover h-39.5 w-76 object-center rounded-3xl opacity-95 dark:opacity-85 hover:opacity-85 dark:hover:opacity-70 border border-primary-300 dark:border-quaternary transition-border cursor-pointer transition"
                  />

                  <input
                     hidden
                     id="image"
                     accept="image/*"
                     type="file"
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

         <FormStatus
            currentStatus={currentStatus}
            setCurrentStatus={setCurrentStatus}
            article={article}
            setIsDefault={setIsDefault}
            isDefault={isDefault}
         >
            <SubmitButton
               handler={handleSubmit(onSubmit, onInvalid)}
               isPending={isLoading}
               loadingText="Saving"
            >
               Save
            </SubmitButton>
         </FormStatus>

         <ResetButton
            handler={async () => {
               reset(article);
               setIsDefault(true);
               setCurrentStatus(articleStatus);

               setLocalArticle({
                  ...article,
                  category: category?.category,
                  flag: LANGUAGES.find((item) => item.code === article.code)
                     .flag,
               });

               const blocks = await editor.tryParseHTMLToBlocks(
                  article.content,
               );
               editor.replaceBlocks(editor.document, blocks);

               setCurrentImage(oldImage);
               document.documentElement.setAttribute('data-lang', article.code);
            }}
         />

         <LanguageButton
            localArticle={localArticle}
            setLocalArticle={setLocalArticle}
            isEdit={true}
            articleCode={article.code}
         />

         <Options editor={editor} currentAuthor={user}>
            <button
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 mb-0.5 rounded-2xl transition"
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
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 transition my-0.5 rounded-2xl"
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
               className="hover:bg-primary-100/80 dark:hover:bg-primary-400/10 transition my-0.5 rounded-2xl order-1"
               onClick={handleSubmit(onSubmit, onInvalid)}
            >
               {isEditing ? (
                  <ImSpinner2 className="py-1 px-3.5 size-13.5 animate-spin" />
               ) : (
                  <LuSave className="py-1 px-3.5 size-13.5 stroke-[1.5px]" />
               )}
            </button>
         </Options>
      </Form>
   );
}

export default EditArticleForm;
