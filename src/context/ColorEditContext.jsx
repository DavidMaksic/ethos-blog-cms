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

      setLightBg(currentCategory?.bgLight);
      setLightText(currentCategory?.textLight);

      setDarkBg(currentCategory?.bgDark);
      setDarkText(currentCategory?.textDark);

      setChartColor(currentCategory?.chartColor);
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
      if (context === 'LightBg') setOpenLightBg((isOpen) => !isOpen);
      if (context === 'LightText') setOpenLightText((isOpen) => !isOpen);
      if (context === 'DarkBg') setOpenDarkBg((isOpen) => !isOpen);
      if (context === 'DarkText') setOpenDarkText((isOpen) => !isOpen);
      if (context === 'Chart') setOpenChart((isOpen) => !isOpen);
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
