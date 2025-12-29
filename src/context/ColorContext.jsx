import { createContext, useContext, useState } from 'react';
import { useColor } from 'react-color-palette';

const ColorContext = createContext();

function ColorContextProvider({ children }) {
   const [openLightBg, setOpenLightBg] = useState(false);
   const [colorLightBg, setColorLightBg] = useColor('#e4d9ffcc');
   const [openLightText, setOpenLightText] = useState(false);
   const [colorLightText, setColorLightText] = useColor('#705d9dcc');

   const [openDarkBg, setOpenDarkBg] = useState(false);
   const [colorDarkBg, setColorDarkBg] = useColor('#605578cc');
   const [openDarkText, setOpenDarkText] = useState(false);
   const [colorDarkText, setColorDarkText] = useColor('#e6dbffcc');

   const [openChart, setOpenChart] = useState(false);
   const [colorChart, setColorChart] = useColor('#a885f9cc');

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
      <ColorContext.Provider
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
         }}
      >
         {children}
      </ColorContext.Provider>
   );
}

function useColorContext() {
   const context = useContext(ColorContext);

   if (context === undefined)
      throw new Error(
         'useColorContext was used outside of ColorContextProvider'
      );

   return context;
}

export { ColorContextProvider, useColorContext }; // eslint-disable-line
