function FormRow({ columns, children }) {
   return <div className={`grid ${columns} gap-32 xl:gap-16`}>{children}</div>;
}

export default FormRow;
