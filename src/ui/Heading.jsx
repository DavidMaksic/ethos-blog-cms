function Heading({ type, children }) {
   const h1 = 'text-3xl xl:text-[1.6rem] font-semibold';
   const h2 = 'text-xl font-semibold';
   const h3 = 'text-lg font-medium';

   return (
      <h1
         className={`
            ${type === 'h1' && h1}
            ${type === 'h2' && h2}
            ${type === 'h3' && h3}
            leading-5
            `}
      >
         {children}
      </h1>
   );
}

export default Heading;
