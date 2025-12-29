import { AnimatePresence, motion } from 'motion/react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { ColorPicker } from 'react-color-palette';

function Color({ label, open, color, setColor, setOpen }) {
   const ref = useOutsideClick(() => setOpen(label), false);

   return (
      <>
         <motion.span
            whileTap={{ scale: 0.9 }}
            className="size-7.5 rounded-3xl cursor-pointer border border-primary-100 transition-[border]"
            style={{ backgroundColor: `${color.hex}` }}
            onClick={(e) => {
               e.stopPropagation();
               setOpen(label);
            }}
         />

         <AnimatePresence>
            {open && (
               <motion.div
                  ref={ref}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.06 }}
               >
                  <ColorPicker color={color} onChange={setColor} />
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}

export default Color;
