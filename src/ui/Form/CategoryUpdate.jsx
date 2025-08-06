import { useEffect, useState } from 'react';
import { useColorEditContext } from '../../context/ColorEditContext';
import { useUpdateCategory } from '../../features/tags/useUpdateCategory';
import { useGetCategories } from '../../features/tags/useGetCategories';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useForm } from 'react-hook-form';

import ColorTableCol from '../../features/tags/ColorTableCol';
import ColorsTable from '../../features/tags/ColorsTable';
import TagButton from '../Buttons/TagButton';
import Context from '../Context';
import TagForm from './TagForm';
import Color from '../../features/tags/Color';
import Error from '../Error';

function CategoryUpdate() {
   const {
      isEditing: isPending,
      isSuccess,
      updateCategory,
   } = useUpdateCategory();

   const { categories } = useGetCategories();
   const [input, setInput] = useState('');

   const { register, handleSubmit, formState } = useForm();
   const { errors } = formState;
   const error = errors?.category?.message;

   const [localTag, setLocalTag] = useLocalStorage(
      {
         category: 'History',
      },
      'updateTag'
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

   useEffect(() => {
      setCurrentTag(localTag);
   }, [setCurrentTag, localTag]);

   function handleCategory({ category }) {
      const { id } = categories.find(
         (item) => item.category === localTag.category
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
         setInput('');
      }
   }, [isSuccess]); // eslint-disable-line

   return (
      <TagForm cols="1fr" isPending={isPending}>
         <div className="flex flex-col gap-12 items-center [&_label]:text-primary-400 [&_label]:font-extralight [&_label]:text-base [&_label]:uppercase">
            <section className="flex gap-20 items-center self-start">
               <div className="flex flex-col gap-3 w-60">
                  <label className="ml-1">Select tag</label>
                  <div className="font-creator">
                     <Context setLocalItem={setLocalTag} localItem={localTag}>
                        {!localTag.category
                           ? categories?.at(0).category
                           : localTag.category}
                     </Context>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label>New name</label>
                  <div className="flex items-center">
                     <input
                        className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none pt-2 text-2xl transition-bg_border"
                        id="category"
                        type="text"
                        autoComplete="one-time-code"
                        value={input}
                        {...register('category', {
                           onChange: (e) => {
                              setInput(e.target.value);
                           },
                        })}
                     />

                     <TagButton
                        input={input}
                        handleSubmit={handleSubmit}
                        error={error}
                        handleCategory={handleCategory}
                     />

                     <div className="ml-4">
                        {error && <Error>{error}</Error>}
                     </div>
                  </div>
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
