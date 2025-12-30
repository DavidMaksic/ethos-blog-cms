import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { useAuthors } from '../features/authentication/useAuthors';

import EditProfileForm from '../features/authentication/EditProfileForm';
import PasswordForm from '../features/authentication/PasswordForm';
import Heading from '../ui/Heading';
import Spinner from '../ui/Spinner';
import Row from '../ui/Row';

function EditProfile() {
   const navigate = useNavigate();

   const { isPending: isLoading, user } = useCurrentAuthor();
   const { isPending: isFetching, authors } = useAuthors();
   const currentAuthor = authors?.find((item) => item.id === user.id);
   const { id } = useParams();

   if (isLoading || isFetching)
      return (
         <div className="h-screen bg-primary">
            <Spinner />
         </div>
      );

   if (currentAuthor?.id !== id) {
      return <Navigate to="/dashboard" />;
   }

   return (
      <div className="flex justify-center gap-10">
         <Row>
            <div className="space-y-8">
               <Row type="horizontal">
                  <div className="flex gap-5 items-center">
                     <Heading type="h1">Edit your profile</Heading>
                     <span className="text-primary-400">|</span>
                     <button
                        onClick={() => navigate(-1)}
                        className="underlined-return text-primary-400"
                     >
                        return
                     </button>
                  </div>
               </Row>

               <Row type="horizontal">
                  <EditProfileForm />
               </Row>
            </div>
         </Row>

         <Row>
            <div className="mt-15">
               <Row type="horizontal">
                  <PasswordForm />
               </Row>
            </div>
         </Row>
      </div>
   );
}

export default EditProfile;
