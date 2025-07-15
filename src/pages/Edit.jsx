import { Link, useNavigate } from 'react-router-dom';
import { useFindArticle } from '../features/archive/useFindArticle';

import ArticleNotFound from '../ui/ArticleNotFound';
import EditSkeleton from '../ui/Skeletons/EditSkeleton';
import EditForm from '../ui/Form/EditForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Edit() {
   const navigate = useNavigate();
   const { article, isPending } = useFindArticle();

   if (isPending) return <EditSkeleton />;
   if (!article)
      return (
         <ArticleNotFound to="/archive" prompt="Go back">
            Article you are looking for does not exist!
         </ArticleNotFound>
      );

   function moveBack() {
      navigate(-1);
   }

   return (
      <>
         <Row type="horizontal">
            <div className="flex items-center gap-6">
               <Heading type="h1">
                  {article.status === 'published' ? 'Edit' : 'Drafted'} article
               </Heading>
               <div className="space-x-4">
                  <span className="text-primary-400">|</span>
                  <Link
                     onClick={moveBack}
                     className="text-primary-400 underlined-return"
                  >
                     return
                  </Link>
               </div>
            </div>
         </Row>

         <Row>
            <EditForm />
         </Row>
      </>
   );
}

export default Edit;
