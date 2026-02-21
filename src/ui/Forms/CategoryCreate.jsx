import { useCreateCategory } from '../../features/tags/useCreateCategory';
import { useGetCategories } from '../../features/tags/useGetCategories';
import { handleValidation } from '../../utils/helpers';
import { useColorContext } from '../../context/ColorContext';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ColorTableCol from '../../features/tags/ColorTableCol';
import ColorsTable from '../../features/tags/ColorsTable';
import TagButton from '../Buttons/TagButton';
import FormItem from './FormItem';
import TagForm from './TagForm';
import Color from '../../features/tags/Color';
import 'react-color-palette/css';

function CategoryCreate() {
   const { isPending, isSuccess, createCategory } = useCreateCategory();
   const { categories } = useGetCategories();

   // - Form logic
   const { register, handleSubmit, watch, formState, reset } = useForm({
      mode: 'onSubmit',
      reValidateMode: 'onChange',
   });
   const input = watch('categoryCreate', '');

   const { errors } = formState;
   const error = errors?.categoryCreate?.message;

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
      if (isSuccess) reset();
   }, [isSuccess, reset]);

   return (
      <TagForm
         cols="0.5_1fr"
         isPending={isPending}
         onSubmit={handleSubmit(handleCategory)}
      >
         <div className="flex flex-col gap-12 items-center [&_label]:text-primary-400 [&_label]:font-light [&_label]:text-base [&_label]:uppercase">
            <section className="flex flex-col gap-2 items-center self-start">
               <FormItem label="Name" error={error} id="name">
                  <div className="flex items-center">
                     <input
                        className="bg-secondary dark:bg-transparent border-b border-b-quaternary dark:border-b-primary-300/30 transition-bg_border outline-none pt-2 text-2xl transition-bg_border"
                        id="name"
                        type="text"
                        autoComplete="one-time-code"
                        {...register('categoryCreate', {
                           required: '*',
                           minLength: {
                              value: 3,
                              message: 'Minimum of 3 characters',
                           },
                           maxLength: {
                              value: 14,
                              message: 'Maximum of 14 characters',
                           },
                           validate: (value) =>
                              handleValidation(value, categories),
                        })}
                     />

                     <TagButton
                        input={input}
                        isPending={isPending}
                        error={error}
                     />
                  </div>
               </FormItem>
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

export default CategoryCreate;
