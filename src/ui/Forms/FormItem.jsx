import Error from '../Error/Error';

function FormItem({ label, error, children }) {
   return (
      <div className="flex flex-col gap-2.5 custom-select">
         <div className="flex items-center gap-3">
            <label htmlFor={children.props.id}>{label}</label>
            <Error error={error} />
         </div>

         {children}
      </div>
   );
}

export default FormItem;
