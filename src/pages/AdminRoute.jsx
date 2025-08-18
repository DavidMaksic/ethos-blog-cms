import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { useAuthors } from '../features/authentication/useAuthors';
import { Navigate } from 'react-router-dom';
import Spinner from '../ui/Spinner';

function AdminRoute({ children }) {
   const { isPending, user } = useCurrentAuthor();
   const { isPending: isLoading, authors } = useAuthors();
   const currentAuthor = authors?.find((item) => item.id === user.id);

   if (isPending || isLoading)
      return (
         <div className="h-screen bg-primary">
            <Spinner />
         </div>
      );

   if (!currentAuthor?.is_admin) {
      return <Navigate to="/dashboard" />;
   }

   return children;
}

export default AdminRoute;
