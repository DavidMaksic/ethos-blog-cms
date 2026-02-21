import LoginForm from '../features/authentication/LoginForm';
import Heading from '../ui/Heading';
import Logo from '../ui/Sidebar/Logo';

function Login() {
   return (
      <main className="min-h-screen flex flex-col gap-10 items-center justify-center bg-primary pb-8 background-gradient -translate-y-6">
         <Logo />
         <Heading type="h1">Sign in to your account</Heading>
         <LoginForm />
      </main>
   );
}

export default Login;
