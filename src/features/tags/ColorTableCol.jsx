function ColorTableCol({
   name,
   hasBorder = true,
   hasMargin,
   picker,
   children,
}) {
   return (
      <div
         className={`${picker} flex flex-col items-center gap-6 px-14 ${
            hasBorder && 'border-r border-r-quaternary transition-[border]'
         } ${hasMargin && 'ml-10'}`}
      >
         <span>{name}</span>

         {children}
      </div>
   );
}

export default ColorTableCol;
