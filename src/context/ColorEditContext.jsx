import { createContext, useContext, useState } from 'react';
import { useGetCategories } from '../features/tags/useGetCategories';
import { useColor } from 'react-color-palette';

const ColorEditContext = createContext();

function ColorEditProvider({ children }) {
   const [currentTag, setCurrentTag] = useState('');
   const { categories } = useGetCategories();
   const currentCategory = categories?.find(
      (item) => currentTag.category === item.category,
   );

   const [openLightBg, setOpenLightBg] = useState(false);
   const [colorLightBg, setColorLightBg] = useColor(
      currentCategory?.bg_light ?? '#fff',
   );
   const [openLightText, setOpenLightText] = useState(false);
   const [colorLightText, setColorLightText] = useColor(
      currentCategory?.text_light ?? '#fff',
   );

   const [openDarkBg, setOpenDarkBg] = useState(false);
   const [colorDarkBg, setColorDarkBg] = useColor(
      currentCategory?.bg_dark ?? '#fff',
   );
   const [openDarkText, setOpenDarkText] = useState(false);
   const [colorDarkText, setColorDarkText] = useColor(
      currentCategory?.text_dark ?? '#fff',
   );

   function togglePicker(context) {
      const currentOpen =
         (context === 'LightBg' && openLightBg) ||
         (context === 'LightText' && openLightText) ||
         (context === 'DarkBg' && openDarkBg) ||
         (context === 'DarkText' && openDarkText);

      setOpenLightBg(false);
      setOpenLightText(false);
      setOpenDarkBg(false);
      setOpenDarkText(false);

      if (!currentOpen) {
         if (context === 'LightBg') setOpenLightBg(true);
         if (context === 'LightText') setOpenLightText(true);
         if (context === 'DarkBg') setOpenDarkBg(true);
         if (context === 'DarkText') setOpenDarkText(true);
      }
   }

   return (
      <ColorEditContext.Provider
         value={{
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

            setCurrentTag,
         }}
      >
         {children}
      </ColorEditContext.Provider>
   );
}

function useColorEditContext() {
   const context = useContext(ColorEditContext);
   if (context === undefined)
      throw new Error(
         'useColorEditContext was used outside of ColorEditProvider',
      );
   return context;
}

export { ColorEditProvider, useColorEditContext }; // eslint-disable-line
