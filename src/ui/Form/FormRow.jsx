function FormRow({ columns, children }) {
   return <div className={`grid ${columns} gap-32`}>{children}</div>;
}

export default FormRow;
