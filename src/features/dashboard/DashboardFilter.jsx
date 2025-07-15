import Filter from '../../ui/Filter/Filter';

function DashboardFilter() {
   return (
      <div className="text-base">
         <Filter
            field="last"
            options={[
               { value: '7', label: 'Last 7 days' },
               { value: '30', label: 'Last 30 days' },
               { value: '90', label: 'Last 90 days' },
            ]}
         />
      </div>
   );
}

export default DashboardFilter;
