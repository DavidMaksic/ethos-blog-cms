import { useNavigate } from 'react-router-dom';
import PasswordForm from '../features/authentication/PasswordForm';
import UpdateForm from '../features/authentication/UpdateForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function UpdateAuthor() {
   const navigate = useNavigate();

   return (
      <div className="flex justify-center gap-10 xl:gap-6">
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
                  <UpdateForm />
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

export default UpdateAuthor;
