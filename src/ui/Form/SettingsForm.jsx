import { useUpdateSetting } from '../../features/settings/useUpdateSetting';
import { useSettings } from '../../features/settings/useSettings';

function SettingsForm() {
   const { isPending, data: { comment_length } = {} } = useSettings();
   const { isUpdating, updateSetting } = useUpdateSetting();

   function handleUpdate(e, field) {
      const { value } = e.target;
      if (!value) return;

      updateSetting({ [field]: value });
   }

   return (
      <div className="flex flex-col gap-12 items-center [&_label]:text-primary-400 [&_label]:font-light [&_label]:text-base [&_label]:uppercase py-12 px-16">
         <div className="flex items-center gap-20 self-start">
            <label htmlFor="comment_length">Comment length</label>

            {isPending ? (
               <div className="2k:h-[2.05rem] h-[2.1rem] w-63 bg-primary-100 dark:bg-primary-100 rounded-xl animate-skeleton" />
            ) : (
               <input
                  className={`bg-secondary dark:bg-primary-200 border-b border-primary-300/80 dark:border-primary-300/50 transition-bg_border outline-none text-2xl ${
                     isUpdating && 'opacity-60 pointer-events-none'
                  }`}
                  onBlur={(e) => handleUpdate(e, 'comment_length')}
                  defaultValue={comment_length}
                  id="comment_length"
                  type="number"
               />
            )}
         </div>
      </div>
   );
}

export default SettingsForm;
