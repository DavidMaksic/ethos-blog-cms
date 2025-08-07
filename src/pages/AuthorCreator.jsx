import { Link, useNavigate } from 'react-router-dom';
import SignupForm from '../features/authentication/SignupForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function AuthorCreator() {
   const navigate = useNavigate();

   function moveBack() {
      navigate(-1);
   }

   return (
      <div className="space-y-8 self-center translate-y-[5%]">
         <Row type="vertical">
            <div className="flex items-center gap-6">
               <Heading type="h1">Create new author</Heading>
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
            <div className="grid grid-cols-[44rem]">
               <SignupForm />
            </div>
         </Row>
      </div>
   );
}

export default AuthorCreator;
