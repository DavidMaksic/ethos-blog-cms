import { createContext, useContext, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { motion } from 'motion/react';

const MenusContext = createContext();

function Menus({ children }) {
   const [openID, setOpenID] = useState('');
   const close = () => setOpenID('');
   const open = setOpenID;

   return (
      <MenusContext.Provider value={{ openID, close, open }}>
         <Menu>{children}</Menu>
      </MenusContext.Provider>
   );
}

function Menu({ children }) {
   return <div className="relative">{children}</div>;
}

function Toggle({ id }) {
   const { openID, close, open } = useContext(MenusContext);

   function handleClick(e) {
      e.stopPropagation();
      openID === '' || openID !== id ? open(id) : close();
   }

   return (
      <button className="w-min" onClick={handleClick}>
         <BsThreeDotsVertical className="text-[2.5rem] p-2.5 rounded-xl transition-[background-color] hover:bg-[#e5e7eb6b] dark:hover:bg-primary cursor-pointer" />
      </button>
   );
}

function List({ id, children }) {
   const { openID, close } = useContext(MenusContext);
   const ref = useOutsideClick(close, false);

   if (openID !== id) return null;

   return (
      <motion.ul
         className="absolute right-7 top-9 mt-2 p-1 max-h-52 text-lg rounded-2xl bg-white dark:bg-primary border border-quaternary shadow-lg cursor-pointer transition-bg_border z-10 overflow-hidden"
         ref={ref}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.08 }}
      >
         {children}
      </motion.ul>
   );
}

function Button({ icon, handler, children }) {
   const { close } = useContext(MenusContext);

   function handleClick() {
      handler?.();
      close();
   }

   return (
      <li>
         <button
            className={`flex items-center gap-2.5 rounded-xl w-full font-normal py-2 px-5 pr-9 hover:bg-primary-100/60 dark:hover:bg-primary-200 transition duration-75 ${
               children?.props?.children === 'Delete' &&
               'text-red-600/60 dark:text-red-300 hover:bg-red-100/30 dark:hover:bg-red-300/10 group'
            } [&_svg]:size-5`}
            onClick={handleClick}
         >
            {icon}
            {children}
         </button>
      </li>
   );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
