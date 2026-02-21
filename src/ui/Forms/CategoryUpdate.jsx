import { useColorEditContext } from '../../context/ColorEditContext';
import { useUpdateCategory } from '../../features/tags/useUpdateCategory';
import { useGetCategories } from '../../features/tags/useGetCategories';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ColorTableCol from '../../features/tags/ColorTableCol';
import ColorsTable from '../../features/tags/ColorsTable';
import Categories from '../Categories';
import TagButton from '../Buttons/TagButton';
import FormItem from './FormItem';
import TagForm from './TagForm';
import Color from '../../features/tags/Color';

function CategoryUpdate() {
   const {
      isEditing: isPending,
      isSuccess,
      updateCategory,
   } = useUpdateCategory();

   const { categories } = useGetCategories();

   const { register, handleSubmit, watch, formState, reset } = useForm();
   const input = watch('categoryUpdate', '');

   const { errors } = formState;
   const error = errors?.categoryUpdate?.message;

   const [localTag, setLocalTag] = useLocalStorage(
      {
         category: 'History',
      },
      'updateTag',
   );

   const [localArticle, setLocalArticle] = useLocalStorage(null, 'article');

   // - Color picker logic
   const {
      togglePicker,

      openLightBg,
      colorLightBg,
      setColorLightBg,
      openLightText,
      colorLightText,
      setColorLightText,

      openDarkBg,
      colorDarkBg,
      setColorDarkBg,
      openDarkText,
      colorDarkText,
      setColorDarkText,

      openChart,
      colorChart,
      setColorChart,

      setCurrentTag,
   } = useColorEditContext();

   useEffect(() => setCurrentTag(localTag), [setCurrentTag, localTag]);

   function handleCategory({ category }) {
      const { id } = categories.find(
         (item) => item.category === localTag.category,
      );
      const updateObject = {
         category,
         id,
         colorLightBg,
         colorLightText,
         colorDarkBg,
         colorDarkText,
         colorChart,
      };
      updateCategory(updateObject);
   }

   useEffect(() => {
      if (isSuccess) {
         setLocalTag({ category: input });
         setLocalArticle({ ...localArticle, category: input });
         reset();
      }
   }, [isSuccess]); // eslint-disable-line

   return (
      <TagForm isPending={isPending} onSubmit={handleSubmit(handleCategory)}>
         <div className="flex flex-col gap-12 items-center [&_label]:text-primary-400 [&_label]:font-light [&_label]:text-base [&_label]:uppercase">
            <section className="flex gap-20 items-center self-start">
               <div className="flex flex-col gap-3 w-60">
                  <label className="ml-1">Select tag</label>
                  <div className="font-creator">
                     <Categories
                        setLocalItem={setLocalTag}
                        localItem={localTag}
                     >
                        {!localTag.category
                           ? categories?.at(0).category
                           : localTag.category}
                     </Categories>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <FormItem label="New name" error={error} id="new-name">
                     <div className="flex items-center">
                        <input
                           className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none pt-2 text-2xl transition-bg_border"
                           id="new-name"
                           type="text"
                           autoComplete="one-time-code"
                           {...register('categoryUpdate', {
                              required: '*',
                              minLength: {
                                 value: 3,
                                 message: 'Minimum of 3 characters',
                              },
                              maxLength: {
                                 value: 14,
                                 message: 'Maximum of 14 characters',
                              },
                           })}
                        />

                        <TagButton
                           input={input}
                           isPending={isPending}
                           error={error}
                        />
                     </div>
                  </FormItem>
               </div>
            </section>

            <ColorsTable input={input} isEdit={true} localTag={localTag}>
               <ColorTableCol
                  name="Light"
                  hasMargin={true}
                  picker={'pickerLight'}
               >
                  <Color
                     label="LightBg"
                     open={openLightBg}
                     setOpen={togglePicker}
                     color={colorLightBg}
                     setColor={setColorLightBg}
                  />
                  <Color
                     label="LightText"
                     open={openLightText}
                     setOpen={togglePicker}
                     color={colorLightText}
                     setColor={setColorLightText}
                  />
               </ColorTableCol>

               <ColorTableCol name="Dark" picker={'pickerDark'}>
                  <Color
                     label="DarkBg"
                     open={openDarkBg}
                     setOpen={togglePicker}
                     color={colorDarkBg}
                     setColor={setColorDarkBg}
                  />
                  <Color
                     label="DarkText"
                     open={openDarkText}
                     setOpen={togglePicker}
                     color={colorDarkText}
                     setColor={setColorDarkText}
                  />
               </ColorTableCol>

               <ColorTableCol
                  name="Chart"
                  hasBorder={false}
                  picker={'pickerChart'}
               >
                  <Color
                     label="Chart"
                     open={openChart}
                     setOpen={togglePicker}
                     color={colorChart}
                     setColor={setColorChart}
                  />
               </ColorTableCol>
            </ColorsTable>
         </div>
      </TagForm>
   );
}

export default CategoryUpdate;
