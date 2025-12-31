function FormRow({ columns, children }) {
   return <div className={`grid ${columns} gap-32 xl:gap-26`}>{children}</div>;
}

export default FormRow;
