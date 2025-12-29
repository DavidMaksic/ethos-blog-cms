function Stats({ title, value, icon, color }) {
   return (
      <div className="flex justify-start gap-4 bg-white dark:bg-primary-300/10 rounded-xl py-4 px-5 box-shadow transition-200">
         <span
            className={`self-center ${color} text-3xl rounded-full p-3.5 transition-bg`}
         >
            {icon}
         </span>
         <div className="flex flex-col self-center gap-1">
            <span className="text-xs uppercase font-semibold text-primary-400 tracking-wider">
               {title}
            </span>
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-600/90 font-logo transition-color pl-0.5">
               {value || '-'}
            </span>
         </div>
      </div>
   );
}

export default Stats;
