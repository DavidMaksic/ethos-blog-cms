import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Spinner from '../ui/Spinner';

function ProtectedRoute({ children }) {
   const navigate = useNavigate();
   const { isPending, isAuthenticated } = useCurrentAuthor();

   useEffect(() => {
      if (!isAuthenticated && !isPending) navigate('/login');
   }, [isAuthenticated, isPending, navigate]);

   if (isPending)
      return (
         <div className="h-screen bg-primary">
            <Spinner />
         </div>
      );

   if (isAuthenticated) return children;
}

export default ProtectedRoute;
