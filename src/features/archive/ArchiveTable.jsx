import { useArticles } from './useArticles';
import ArticleNotFound from '../../ui/ArticleNotFound';
import TableSkeleton from '../../ui/Skeletons/TableSkeleton';
import TableHeader from '../../ui/Table/TableHeader';
import Pagination from '../../ui/Operations/Pagination';
import ArchiveRow from './ArchiveRow';
import Table from '../../ui/Table/Table';
import Menus from '../../ui/Menus';

function ArchiveTable() {
   const { isPending, articles, count } = useArticles();

   if (isPending) return <TableSkeleton />;
   if (!articles?.length)
      return <ArticleNotFound>No matching results!</ArticleNotFound>;

   return (
      <Menus>
         <Table>
            <TableHeader>
               <div></div>
               <div>Title</div>
               <div>Date</div>
               <div>Status</div>
               <div>Author</div>
            </TableHeader>

            {articles.map((article, index) => (
               <ArchiveRow
                  article={article}
                  key={article.id}
                  isFirst={index === 0}
                  isLast={index === articles.length - 1}
               />
            ))}

            {articles.length && <Pagination count={count} />}
         </Table>
      </Menus>
   );
}

export default ArchiveTable;
