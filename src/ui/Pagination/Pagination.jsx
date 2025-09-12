import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import PaginationButton from './PaginationButton';

function Pagination({ count }) {
   const [searchParams, setSearchParams] = useSearchParams();
   const currentPage = !searchParams.get('page')
      ? 1
      : Number(searchParams.get('page'));

   const pageCount = Math.ceil(count / PAGE_SIZE);

   function nextPage() {
      const next = currentPage === pageCount ? currentPage : currentPage + 1;

      searchParams.set('page', next);
      setSearchParams(searchParams);
   }

   function prevPage() {
      const prev = currentPage === 1 ? currentPage : currentPage - 1;

      searchParams.set('page', prev);
      setSearchParams(searchParams);
   }

   if (pageCount <= 1) return null;

   return (
      <div className="flex justify-between items-center p-3 px-6 bg-primary-50 dark:bg-table rounded-b-2xl text-sm transition-bg">
         <div className="flex items-center">
            <span>Showing&nbsp;</span>
            <div className="bg-primary-200 p-0.5 px-2 rounded-lg transition-bg">
               <span className="font-semibold">
                  {(currentPage - 1) * PAGE_SIZE + 1}
               </span>
               <span>&nbsp;to&nbsp;</span>
               <span className="font-semibold">
                  {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
               </span>
            </div>
            <span>&nbsp;of&nbsp;</span>
            <span className="font-semibold">{count}&nbsp;</span>
            <span>results</span>
         </div>

         <div className="flex gap-2 font-medium">
            <PaginationButton
               type="Previous"
               handler={() => prevPage()}
               disabled={currentPage === 1}
            >
               <IoChevronBackOutline />
            </PaginationButton>

            <PaginationButton
               type="Next"
               handler={() => nextPage()}
               disabled={currentPage === pageCount}
            >
               <IoChevronForwardOutline />
            </PaginationButton>
         </div>
      </div>
   );
}

export default Pagination;
