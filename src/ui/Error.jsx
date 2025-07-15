function Error({ children }) {
   return (
      <div
         className={`text-red-300 rounded-full ${
            children === '*' ? 'text-xl' : ''
         }`}
      >
         {children === '*' ? children : `* ${children}`}
      </div>
   );
}

export default Error;
