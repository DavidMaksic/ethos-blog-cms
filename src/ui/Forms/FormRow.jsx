function FormRow({ columns, children }) {
   return (
      <div className={`grid ${columns} 2k:gap-28 gap-32 xl:gap-26`}>
         {children}
      </div>
   );
}

export default FormRow;
