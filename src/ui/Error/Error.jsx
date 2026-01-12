function Error({ children }) {
   return (
      <div
         className={`text-red-400/90 dark:text-red-300 font-semibold dark:font-normal rounded-full ${
            children === '*' ? 'text-xl' : ''
         }`}
      >
         {children === '*' ? children : `* ${children}`}
      </div>
   );
}

export default Error;
