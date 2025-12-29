import HeaderOptions from './HeaderOptions';
import HeaderUser from './HeaderUser';

function Header() {
   return (
      <header className="flex flex-col items-center justify-end border border-quaternary bg-white dark:bg-primary-300/10 dark:border-primary-300/10 [transition:transform_0.2s,background-color_0.2s,border_0.2s] ease-in-out mt-auto rounded-2xl py-2">
         <HeaderUser />
         <HeaderOptions />
      </header>
   );
}

export default Header;
