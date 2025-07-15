import Error from '../Error';

function FormItem({ label, error, children }) {
   return (
      <div className="flex flex-col gap-2.5 custom-select xl:leading-6">
         <div className={`flex ${error === '*' ? 'gap-1.5' : 'gap-7'}`}>
            <label htmlFor={children.props.id}>{label}</label>
            {error && <Error>{error}</Error>}
         </div>

         {children}
      </div>
   );
}

export default FormItem;
