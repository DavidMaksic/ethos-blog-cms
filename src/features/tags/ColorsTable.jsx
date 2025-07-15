import { useEffect, useState } from 'react';
import { useColorEditContext } from '../../context/ColorEditContext';
import { useColorContext } from '../../context/ColorContext';
import { useDarkMode } from '../../context/DarkModeContext';

function ColorsTable({ input, isEdit = false, localTag, children }) {
   const { colorLightBg, colorLightText, colorDarkBg, colorDarkText } =
      useColorContext();

   const {
      colorLightBg: editLightBg,
      colorLightText: editLightText,
      colorDarkBg: editDarkBg,
      colorDarkText: editDarkText,
   } = useColorEditContext();

   const { isDarkMode } = useDarkMode();
   const [bgColor, setBgColor] = useState('');
   const [textColor, setTextColor] = useState('');

   useEffect(() => {
      if (isEdit) {
         if (isDarkMode) {
            setBgColor(editDarkBg);
            setTextColor(editDarkText);
         } else {
            setBgColor(editLightBg);
            setTextColor(editLightText);
         }
      } else {
         if (isDarkMode) {
            setBgColor(colorDarkBg);
            setTextColor(colorDarkText);
         } else {
            setBgColor(colorLightBg);
            setTextColor(colorLightText);
         }
      }
   }, [
      isEdit,
      isDarkMode,
      colorDarkBg,
      colorDarkText,
      colorLightBg,
      colorLightText,
      editDarkBg,
      editDarkText,
      editLightBg,
      editLightText,
   ]);

   return (
      <div className="grid grid-cols-[45rem_1fr] xl:grid-cols-[40rem_1fr] self-start gap-14 xl:gap-8">
         <div className="flex flex-col gap-3 items-center">
            <label className="self-start">Colors</label>
            <section className="grid grid-cols-[0.2fr_1fr_1fr_1fr] self-start border border-quaternary rounded-2xl py-6 pb-8 px-4  transition-[border]">
               <div className="flex flex-col gap-6 mt-13 pl-4">
                  <span>Background</span>
                  <span>Text</span>
               </div>

               {children}
            </section>
         </div>

         <div className="flex flex-col gap-3 items-center">
            <label className="self-start">Preview</label>
            <section className="border border-quaternary rounded-2xl py-20 px-16 transition-[border]">
               <span
                  className={`font-article w-min px-7 py-2.5 pb-3 rounded-full font-bold text-2xl transition-bg`}
                  style={{
                     backgroundColor: `${bgColor?.hex}`,
                     color: `${textColor?.hex}`,
                  }}
               >
                  {!isEdit
                     ? input
                        ? input
                        : 'History'
                     : input
                     ? input
                     : localTag?.category}
               </span>
            </section>
         </div>
      </div>
   );
}

export default ColorsTable;
