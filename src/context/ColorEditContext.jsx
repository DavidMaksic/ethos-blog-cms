import { createContext, useContext, useEffect, useState } from 'react';
import { useGetCategories } from '../features/tags/useGetCategories';
import { useColor } from 'react-color-palette';

const ColorEditContext = createContext();

function ColorEditProvider({ children }) {
   const [currentTag, setCurrentTag] = useState('');
   const { categories } = useGetCategories();

   const [lightBg, setLightBg] = useState();
   const [lightText, setLightText] = useState();
   const [darkBg, setDarkBg] = useState();
   const [darkText, setDarkText] = useState();
   const [chartColor, setChartColor] = useState();

   useEffect(() => {
      const currentCategory = categories?.find(
         (item) => currentTag.category === item.category
      );

      setLightBg(currentCategory?.bg_light);
      setLightText(currentCategory?.text_light);

      setDarkBg(currentCategory?.bg_dark);
      setDarkText(currentCategory?.text_dark);

      setChartColor(currentCategory?.chart_color);
   }, [categories, currentTag]);

   const [openLightBg, setOpenLightBg] = useState(false);
   const [colorLightBg, setColorLightBg] = useColor(lightBg ? lightBg : '#fff');
   const [openLightText, setOpenLightText] = useState(false);
   const [colorLightText, setColorLightText] = useColor(
      lightText ? lightText : '#fff'
   );

   const [openDarkBg, setOpenDarkBg] = useState(false);
   const [colorDarkBg, setColorDarkBg] = useColor(darkBg ? darkBg : '#fff');
   const [openDarkText, setOpenDarkText] = useState(false);
   const [colorDarkText, setColorDarkText] = useColor(
      darkText ? darkText : '#fff'
   );

   const [openChart, setOpenChart] = useState(false);
   const [colorChart, setColorChart] = useColor(
      chartColor ? chartColor : '#fff'
   );

   function togglePicker(context) {
      const currentOpen =
         (context === 'LightBg' && openLightBg) ||
         (context === 'LightText' && openLightText) ||
         (context === 'DarkBg' && openDarkBg) ||
         (context === 'DarkText' && openDarkText) ||
         (context === 'Chart' && openChart);

      // Close all modals
      setOpenLightBg(false);
      setOpenLightText(false);
      setOpenDarkBg(false);
      setOpenDarkText(false);
      setOpenChart(false);

      // Toggle current modal
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
         'useColorEditContext was used outside of ColorEditProvider'
      );

   return context;
}

export { ColorEditProvider, useColorEditContext }; // eslint-disable-line
