import Filter from '../../ui/Filter/Filter';
import SortBy from '../../ui/SortBy';

function ArchiveOps() {
   return (
      <div className="flex items-center gap-10 text-base">
         <Filter
            field="status"
            options={[
               { value: 'all', label: 'All' },
               { value: 'published', label: 'Published' },
               { value: 'drafted', label: 'Drafted' },
            ]}
         />

         <SortBy
            options={[
               {
                  value: 'created_at-desc',
                  label: 'Latest',
               },
               {
                  value: 'created_at-asc',
                  label: 'Oldest',
               },
               {
                  value: 'title-asc',
                  label: 'A-Z',
               },
               {
                  value: 'title-desc',
                  label: 'Z-A',
               },
            ]}
         />
      </div>
   );
}

export default ArchiveOps;
