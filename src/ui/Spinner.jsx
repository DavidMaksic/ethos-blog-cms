function Spinner() {
   return (
      <div className="fixed left-[50%] top-[50%] z-1 translate-x-[-50%] translate-y-[-100%]">
         <div className="main-spinner inline-block relative box-border size-[100px] border-2 border-primary-200 rounded-full animate-spin">
            <div className="content-[''] box-border absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] size-[100px] rounded-full border-t-2 border-t-accent-500 border-r-3 border-r-transparent" />
         </div>
      </div>
   );
}

export default Spinner;
