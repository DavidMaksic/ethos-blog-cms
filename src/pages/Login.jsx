import LoginForm from '../features/authentication/LoginForm';
import Heading from '../ui/Heading';
import Logo from '../ui/Sidebar/Logo';

function Login() {
   return (
      <main className="bg-primary background-gradient">
         <div className="min-h-screen flex flex-col gap-10 items-center justify-center -translate-y-6">
            <Logo />
            <Heading type="h1">Sign in to your account</Heading>
            <LoginForm />
         </div>
      </main>
   );
}

export default Login;
