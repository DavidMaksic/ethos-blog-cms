import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { useFindArticle } from '../features/archive/useFindArticle';
import { useAuthors } from '../features/authentication/useAuthors';

import ArticleNotFound from '../ui/ArticleNotFound';
import EditSkeleton from '../ui/Skeletons/EditSkeleton';
import EditForm from '../ui/Forms/EditForm';
import Heading from '../ui/Heading';
import Spinner from '../ui/Spinner';
import Row from '../ui/Row';

function Edit() {
   const navigate = useNavigate();
   const { article, isPending } = useFindArticle();

   const { isPending: isLoading, user } = useCurrentAuthor();
   const { isPending: isFetching, authors } = useAuthors();
   const currentAuthor = authors?.find((item) => item.id === user.id);

   if (isLoading || isFetching)
      return (
         <div className="h-screen bg-primary">
            <Spinner />
         </div>
      );

   if (currentAuthor?.id !== article?.author_id && !currentAuthor?.is_admin) {
      return <Navigate to="/dashboard" />;
   }

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
