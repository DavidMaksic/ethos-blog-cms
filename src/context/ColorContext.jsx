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
      if (context === 'LightBg') setOpenLightBg((isOpen) => !isOpen);
      if (context === 'LightText') setOpenLightText((isOpen) => !isOpen);
      if (context === 'DarkBg') setOpenDarkBg((isOpen) => !isOpen);
      if (context === 'DarkText') setOpenDarkText((isOpen) => !isOpen);
      if (context === 'Chart') setOpenChart((isOpen) => !isOpen);
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
