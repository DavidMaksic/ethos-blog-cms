/* eslint-disable no-unused-vars */
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { useGetCategories } from '../../features/tags/useGetCategories';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEditArticle } from '../../features/archive/useEditArticle';
import { useFindArticle } from '../../features/archive/useFindArticle';
import { HiOutlineInbox } from 'react-icons/hi';
import { useFullscreen } from '../../context/FullscreenContext';
import { BlockNoteView } from '@blocknote/mantine';
import { IoMoonOutline } from 'react-icons/io5';
import { useUnFeature } from '../../features/archive/useUnFeature';
import { insertAlert } from '../../utils/helpers';
import { useDarkMode } from '../../context/DarkModeContext';
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
import FormStatus from './FormStatus';
import FormItem from './FormItem';
import Context from '../Context';
import FormRow from './FormRow';
import Options from '../Options';
import Form from './Form';

function EditForm() {
   const { article, isPending } = useFindArticle();
   const { ...articleValues } = article;
   const oldImage = article.image;

   // - Category logic
   const { categories } = useGetCategories();
   const category = categories?.find(
      (item) => item.id === articleValues.categoryID
   );

   // - LocalStorage logic
   const [localArticle, setLocalArticle] = useLocalStorage(
      {
         articleValues,
         category: category?.category,
      },
      'localArticle'
   );

   useEffect(() => {
      document.documentElement.setAttribute('data-lang', localArticle.language);
   }, [localArticle]);

   // - Status logic
   const articleStatus =
      article.status.charAt(0).toUpperCase() + article.status.slice(1);
   const [currentStatus, setCurrentStatus] = useState(articleStatus);

   // - Set category in localStorage on load
   useEffect(() => {
      setLocalArticle({ ...article, category: category?.category });
   }, [setLocalArticle, article, category]);

   // - Form logic
   const { register, handleSubmit, formState, reset } = useForm({
      defaultValues: articleValues,
   });
   const { errors } = formState;

   // - Other
   const [isDefault, setIsDefault] = useState(true);
   const { isDarkMode, toggleDarkMode } = useDarkMode();

   const { setLocalFullscreen, isFullscreen, setIsFullscreen } =
      useFullscreen();

   // - Editor logic
   const [contentHTML, setContentHTML] = useState('');
   const [contentBlocks, setContentBlocks] = useState('');
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

   const onChange = async () => {
      const html = await editor.blocksToFullHTML(editor.document);
      setContentHTML(html);
   };

   useEffect(() => {
      const getBlocks = async () => {
         const blocks = await editor.tryParseHTMLToBlocks(article.content);
         editor.replaceBlocks(editor.document, blocks);
         setContentBlocks(blocks);
      };
      getBlocks();
   }, [editor, article]);

   // - React Query logic
   const [currentImage, setCurrentImage] = useState(oldImage);
   const { isUnFeaturing, unFeature } = useUnFeature();
   const { isEditing, editArticle } = useEditArticle();

   function onSubmit(data) {
      const { id: categoryID } = categories.find(
         (item) => item.category === localArticle.category
      );

      editArticle({
         ...data,
         image: currentImage,
         oldImage,
         content: contentHTML,
         categoryID,
         status: currentStatus.charAt(0).toLowerCase() + currentStatus.slice(1),
         language: localArticle.language,
         flag: localArticle.flag,
      });

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
      setCurrentImage(img);

      if (imageRef?.current) {
         imageRef.current.src = URL.createObjectURL(img);
         imageRef.current.srcset = URL.createObjectURL(img);
      }
   }

   const [imgReload, setImgReload] = useState(false);

   useEffect(() => {
      if (imgReload) {
         imageRef.current.src = oldImage;
         imageRef.current.srcset = oldImage;
         setImgReload(false);
      }
   }, [currentImage, oldImage, imgReload]);

   const isLoading = isPending || isEditing || isUnFeaturing;

   return (
      <Form isPending={isLoading}>
         <FormRow columns="4k:grid-cols-[1.8fr_1fr]! grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Title" error={errors?.title?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border text-3xl outline-none scrollbar mt-3"
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
               <Context
                  setLocalItem={setLocalArticle}
                  isDefault={isDefault}
                  setIsDefault={setIsDefault}
                  article={article}
                  localItem={localArticle}
                  isEdit={true}
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
               </Context>
            </FormItem>
         </FormRow>

         <FormRow columns="4k:grid-cols-[1.8fr_1fr]! grid-cols-[2fr_1fr] 2xl:grid-cols-[1.8fr_1fr]">
            <FormItem label="Description" error={errors?.description?.message}>
               <TextareaAutosize
                  className="bg-secondary dark:bg-primary-200 text-3xl border-b border-b-quaternary transition-bg_border outline-none scrollbar mt-3"
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
               <label htmlFor="image">
                  <img
                     ref={imageRef}
                     src={currentImage}
                     className="object-cover h-39.5 w-76 object-center rounded-3xl dark:opacity-90 border border-primary-300 dark:border-quaternary transition-border cursor-pointer"
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
            handler={() => {
               reset();
               setIsDefault(true);
               setCurrentStatus(articleStatus);
               setLocalArticle({
                  ...article,
                  category: category?.category,
               });
               editor.replaceBlocks(editor.document, contentBlocks);
               setCurrentImage(oldImage);
               setImgReload(true);
            }}
         />

         <LanguageButton
            localItem={localArticle}
            setLocalItem={setLocalArticle}
         />

         <Options isEdit={true}>
            <button
               className="hover:bg-primary-100 dark:hover:bg-primary-200 transition-bg my-0.5 rounded-2xl"
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
               className="hover:bg-primary-100 dark:hover:bg-primary-200 mb-0.5 rounded-2xl"
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
      </Form>
   );
}

export default EditForm;
