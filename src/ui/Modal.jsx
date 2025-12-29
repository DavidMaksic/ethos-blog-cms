import { createPortal } from 'react-dom';
import { useModal } from '../hooks/useModal';
import { motion } from 'motion/react';

function Modal({ closeModal, style, children }) {
   const ref = useModal(closeModal);

   return createPortal(
      <motion.div
         className="fixed top-0 left-0 h-screen w-full dark:bg-[#41455334] backdrop-blur-2xl z-40"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.1 }}
      >
         <motion.div
            className={`fixed top-[45%] left-1/2 px-4 py-12 pt-14 translate-x-[-50%] translate-y-[-50%] font-creator shadow-modal dark:shadow-none flex flex-col gap-4 items-center text-[2.4rem] rounded-4xl bg-white/90 dark:bg-primary/90 border border-quaternary dark:border-tertiary overflow-hidden ${style}`}
            layout
            transition={{ duration: 0.3 }}
            ref={ref}
         >
            {children}
         </motion.div>
      </motion.div>,
      document.body
   );
}

export default Modal;
