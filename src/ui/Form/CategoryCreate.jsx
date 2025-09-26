import { useEffect, useState } from 'react';
import { useCreateCategory } from '../../features/tags/useCreateCategory';
import { useGetCategories } from '../../features/tags/useGetCategories';
import { useColorContext } from '../../context/ColorContext';
import { handleValidation } from '../../utils/helpers';
import { useForm } from 'react-hook-form';

import ColorTableCol from '../../features/tags/ColorTableCol';
import ColorsTable from '../../features/tags/ColorsTable';
import TagButton from '../Buttons/TagButton';
import TagForm from './TagForm';
import Color from '../../features/tags/Color';
import Error from '../Error';
import 'react-color-palette/css';

function CategoryForm() {
   const { isPending, isSuccess, createCategory } = useCreateCategory();
   const { categories } = useGetCategories();

   // - Form logic
   const [input, setInput] = useState('');
   const { register, handleSubmit, formState } = useForm();
   const { errors } = formState;
   const error = errors?.category?.message;

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
   } = useColorContext();

   function handleCategory(data) {
      const finalData = {
         category: data.category,
         bg_light: colorLightBg.hex,
         bg_dark: colorDarkBg.hex,
         text_light: colorLightText.hex,
         text_dark: colorDarkText.hex,
         chart_color: colorChart.hex,
      };
      createCategory(finalData);
   }

   useEffect(() => {
      if (isSuccess) setInput('');
   }, [isSuccess]);

   return (
      <TagForm cols="0.5_1fr" isPending={isPending}>
         <div className="flex flex-col gap-12 items-center [&_label]:text-primary-400 [&_label]:font-extralight [&_label]:text-base [&_label]:uppercase">
            <section className="flex flex-col gap-2 items-center self-start">
               <label className="self-start">Name</label>
               <div className="flex items-center">
                  <input
                     className="bg-secondary dark:bg-primary-200 border-b border-b-quaternary transition-bg_border outline-none pt-2 text-2xl transition-bg_border"
                     id="category"
                     type="text"
                     autoComplete="one-time-code"
                     value={input}
                     {...register('category', {
                        validate: (value) =>
                           handleValidation(value, categories),
                        onChange: (e) => {
                           setInput(e.target.value);
                        },
                     })}
                  />

                  <TagButton
                     input={input}
                     isPending={isPending}
                     handleSubmit={handleSubmit}
                     error={error}
                     handleCategory={handleCategory}
                  />

                  <div className="ml-4">{error && <Error>{error}</Error>}</div>
               </div>
            </section>

            <ColorsTable input={input}>
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

export default CategoryForm;
