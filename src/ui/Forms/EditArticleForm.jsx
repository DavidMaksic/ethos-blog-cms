/* eslint-disable no-unused-vars */
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { CONTENT_DEBOUNCE, LANGUAGES } from '../../utils/constants';
import { useEffect, useRef, useState } from 'react';
import { insertAlert, toSlug } from '../../utils/helpers';
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
import { LuSunMedium } from 'react-icons/lu';
import { ImSpinner2 } from 'react-icons/im';
import { useForm } from 'react-hook-form';
import { Alert } from '../Alert';
import { en } from '../../../node_modules/@blocknote/core/src/i18n/locales/en';

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
import LanguageButton from '../Buttons/LanguageButton';
import SubmitButton from '../Buttons/SubmitButton';
import ResetButton from '../Buttons/ResetButton';
import Categories from '../Categories';
import FormStatus from './FormStatus';
import FormItem from './FormItem';
import Options from '../Operations/Options';
import FormRow from './FormRow';
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
      'editArticle'
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

   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   useEffect(() => {
      setLocalFullscreen(true);
      setIsFullscreen(true);
   }, []); // eslint-disable-line

   // - Editor logic
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
      trailingBlock: false,
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
      const html = await editor.blocksToFullHTML(editor.document);
      setContentHTML(html);
   };

   // - 3 effects for initial sync between inputs and localStorage
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

   useEffect(() => {
      // - Populate content with correct data
      const loadBlocks = async () => {
         const html =
            article?.id && article.id !== localArticle.id
               ? article.content
               : localArticle.content;

         const blocks = await editor.tryParseHTMLToBlocks(html);
         editor.replaceBlocks(editor.document, blocks);
      };

      loadBlocks();
   }, []); // eslint-disable-line

   useEffect(() => {
      setCurrentImage(localArticle?.image || oldImage);
   }, [localArticle?.image, oldImage]);

   // - React Query logic
   const [currentImage, setCurrentImage] = useState();
   const { isUnFeaturing, unFeature } = useUnFeature();
   const { isEditing, editArticle } = useEditArticle();

   function onSubmit(data) {
      const { id: category_id } = categories.find(
         (item) => item.category === localArticle.category
      );

      const slug = toSlug(data.title);
      const oldArticle = article;

      editArticle(
         {
            ...data,
            image: currentImage,
            oldImage,
            content: contentHTML,
            category_id,
            status:
               currentStatus.charAt(0).toLowerCase() + currentStatus.slice(1),
            code: localArticle.code,
            slug,
            oldArticle,
         },
         {
            onSuccess: () => {
               localStorage.removeItem('editArticle');
            },
         }
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

      const objectUrl = URL.createObjectURL(img);
      setCurrentImage(objectUrl);

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

   const isLoading = isPending || isEditing || isUnFeaturing;

   return (
      <Form isPending={isLoading}>
         <FormRow columns="grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Title" error={errors?.title?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-transparent border-b border-b-quaternary transition-bg_border text-3xl outline-none scrollbar mt-3"
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
                  className="bg-secondary dark:bg-transparent text-3xl border-b border-b-quaternary transition-bg_border outline-none scrollbar mt-3"
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

         <FormStatus
            currentStatus={currentStatus}
            setCurrentStatus={setCurrentStatus}
            article={article}
            setIsDefault={setIsDefault}
            isDefault={isDefault}
         >
            <SubmitButton
               handler={handleSubmit(onSubmit)}
               isPending={isLoading}
               loadingText="Saving"
            >
               Save
            </SubmitButton>
         </FormStatus>

         <ResetButton
            handler={async () => {
               reset();
               setIsDefault(true);
               setCurrentStatus(articleStatus);

               setLocalArticle({
                  ...article,
                  category: category?.category,
                  flag: LANGUAGES.find((item) => item.code === article.code)
                     .flag,
               });

               const blocks = await editor.tryParseHTMLToBlocks(
                  article.content
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

         <Options isEdit={true} currentAuthor={user}>
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
         </Options>
      </Form>
   );
}

export default EditArticleForm;
