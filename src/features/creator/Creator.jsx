import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { CONTENT_DEBOUNCE, DEFAULT_LANG, FLAGS } from '../../utils/constants';
import {
   generateBlurDataURLFromURL,
   appendDimensionsToHTML,
   generateBlurDataURL,
   blockNoteSchema,
   insertAlert,
   toSlug,
} from '../../utils/helpers';
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
import { useForm } from 'react-hook-form';
import { en } from '@blocknote/core/locales';

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
   const contentHTMLRef = useRef('');

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
   const saveTimeoutRef = useRef(null);

   const onChange = () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
         const html = await editor.blocksToFullHTML(editor.document);
         contentHTMLRef.current = html;
         setLocalArticle((prev) => ({
            ...prev,
            content: editor.document,
         }));
      }, CONTENT_DEBOUNCE);
   };

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      };
   }, []);

   const { categories } = useGetCategories();

   // - Image select logic
   const imageRef = useRef(null);
   const imageRegister = register('image', { required: '*' });

   async function handlePreviewImage(e) {
      imageRegister.onChange(e);
      const img = e.target.files[0];
      if (!img) return;

      // Generate blur hash client-side immediately
      const { blurDataURL } = await generateBlurDataURL(img);

      const reader = new FileReader();
      reader.onloadend = () => {
         setLocalArticle((prev) => ({
            ...prev,
            image: reader.result,
            imageBlur: blurDataURL, // <-- store alongside image
            imageMeta: { name: img.name, type: img.type },
         }));
      };
      reader.readAsDataURL(img);
   }

   const [isProcessing, setIsProcessing] = useState(false);

   // - Submit functions
   async function onSubmit(data) {
      setIsProcessing(true);

      try {
         let category_id;
         category_id = categories.find(
            (item) => item.category === localArticle?.category,
         )?.id;
         if (!category_id) category_id = categories[0].id;

         const slug = toSlug(data.title);
         const html = await editor.blocksToFullHTML(editor.document);
         const htmlWithDimensions = await appendDimensionsToHTML(html);

         const imgSrcs = [
            ...htmlWithDimensions.matchAll(/<img[^>]+src="([^"]+)"/g),
         ].map((m) => m[1].replaceAll('&amp;', '&'));

         const blurEntries = await Promise.all(
            imgSrcs.map(async (src) => {
               const cleanSrc = src.split('?')[0];
               const { blurDataURL, isTransparent } =
                  await generateBlurDataURLFromURL(src);
               return [cleanSrc, { blurDataURL, isTransparent }];
            }),
         );
         const contentBlurMap = Object.fromEntries(blurEntries);

         createArticle(
            {
               ...data,
               image: localArticle.image,
               image_blur: localArticle.imageBlur,
               category_id,
               status: 'published',
               author_id: user.id,
               content: htmlWithDimensions,
               content_blur_map: contentBlurMap,
               featured: false,
               main_feature: false,
               code: localArticle.code,
               slug,
            },
            {
               onSuccess: () => {
                  clear();
                  setIsProcessing(false);
               },
               onError: () => setIsProcessing(false),
            },
         );
      } catch {
         setIsProcessing(false);
      }
   }

   async function onSubmitDraft(data) {
      setIsProcessing(true);
      try {
         let category_id;
         category_id = categories.find(
            (item) => item.category === localArticle?.category,
         )?.id;
         if (!category_id) category_id = categories[0].id;

         const slug = toSlug(data.title);
         const html = await editor.blocksToFullHTML(editor.document);
         const htmlWithDimensions = await appendDimensionsToHTML(html);

         // Extract all img srcs from content and generate blur data
         const imgSrcs = [
            ...htmlWithDimensions.matchAll(/<img[^>]+src="([^"]+)"/g),
         ].map((m) => m[1].replaceAll('&amp;', '&'));

         const blurEntries = await Promise.all(
            imgSrcs.map(async (src) => {
               const cleanSrc = src.split('?')[0];
               const { blurDataURL, isTransparent } =
                  await generateBlurDataURLFromURL(src);
               return [cleanSrc, { blurDataURL, isTransparent }];
            }),
         );
         const contentBlurMap = Object.fromEntries(blurEntries);

         createArticle(
            {
               ...data,
               image: localArticle.image,
               image_blur: localArticle.imageBlur,
               category_id,
               status: 'drafted',
               author_id: user.id,
               content: htmlWithDimensions,
               content_blur_map: contentBlurMap,
               featured: false,
               main_feature: false,
               code: localArticle.code,
               slug,
            },
            {
               onSuccess: () => {
                  clear();
                  setIsProcessing(false);
               },
               onError: () => setIsProcessing(false),
            },
         );
      } catch {
         setIsProcessing(false);
      }
   }

   // - Reset logic
   const [activeButton, setActiveButton] = useState(null);

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
      document.getElementById('image').value = '';
      setActiveButton(null);
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
      <Form isDiv={true} isPending={isPending}>
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
                     {...imageRegister}
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
            value={contentHTMLRef.current}
         />

         <div className="flex justify-center items-center gap-8">
            <SubmitButton
               handler={handleSubmit(onSubmit, onInvalid)}
               isPending={
                  (isPending || isProcessing) && activeButton === 'publish'
               }
               loadingText="Publishing"
               onClick={() => setActiveButton('publish')}
            >
               Publish
            </SubmitButton>
            <span className="italic text-4xl text-primary-400">or</span>
            <DraftButton
               handler={handleSubmit(onSubmitDraft, onInvalid)}
               isPending={
                  (isPending || isProcessing) && activeButton === 'draft'
               }
               onClick={() => setActiveButton('draft')}
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
