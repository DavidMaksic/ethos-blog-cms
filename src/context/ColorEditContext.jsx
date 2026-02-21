import { createContext, useContext, useEffect, useState } from 'react';
import { useGetCategories } from '../features/tags/useGetCategories';
import { hexToColor } from '../utils/helpers';
import { useColor } from 'react-color-palette';

const ColorEditContext = createContext();

function ColorEditProvider({ children }) {
   const [currentTag, setCurrentTag] = useState('');
   const { categories } = useGetCategories();

   const [openLightBg, setOpenLightBg] = useState(false);
   const [colorLightBg, setColorLightBg] = useColor('#fff');
   const [openLightText, setOpenLightText] = useState(false);
   const [colorLightText, setColorLightText] = useColor('#fff');

   const [openDarkBg, setOpenDarkBg] = useState(false);
   const [colorDarkBg, setColorDarkBg] = useColor('#fff');
   const [openDarkText, setOpenDarkText] = useState(false);
   const [colorDarkText, setColorDarkText] = useColor('#fff');

   const [openChart, setOpenChart] = useState(false);
   const [colorChart, setColorChart] = useColor('#fff');

   useEffect(() => {
      const currentCategory = categories?.find(
         (item) => currentTag.category === item.category,
      );
      if (!currentCategory) return;

      setColorLightBg(hexToColor(currentCategory.bg_light));
      setColorLightText(hexToColor(currentCategory.text_light));
      setColorDarkBg(hexToColor(currentCategory.bg_dark));
      setColorDarkText(hexToColor(currentCategory.text_dark));
      setColorChart(hexToColor(currentCategory.chart_color));
   }, [categories, currentTag]); // eslint-disable-line

   function togglePicker(context) {
      const currentOpen =
         (context === 'LightBg' && openLightBg) ||
         (context === 'LightText' && openLightText) ||
         (context === 'DarkBg' && openDarkBg) ||
         (context === 'DarkText' && openDarkText) ||
         (context === 'Chart' && openChart);

      setOpenLightBg(false);
      setOpenLightText(false);
      setOpenDarkBg(false);
      setOpenDarkText(false);
      setOpenChart(false);

      if (!currentOpen) {
         if (context === 'LightBg') setOpenLightBg(true);
         if (context === 'LightText') setOpenLightText(true);
         if (context === 'DarkBg') setOpenDarkBg(true);
         if (context === 'DarkText') setOpenDarkText(true);
         if (context === 'Chart') setOpenChart(true);
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

            openChart,
            colorChart,
            setColorChart,
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
