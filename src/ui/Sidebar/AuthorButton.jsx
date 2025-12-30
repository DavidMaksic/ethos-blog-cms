function AuthorButton({ handler, loading, children }) {
   const disableClick = loading && 'pointer-events-none';

   return (
      <button
         className={`bg-none border-none p-2 rounded-xl transition-200 hover:bg-primary-100 dark:hover:bg-primary-300/25 [&_svg]:size-6 [&_svg]:text-accent ${disableClick}`}
         onClick={() => handler()}
      >
         {children}
      </button>
   );
}

export default AuthorButton;
