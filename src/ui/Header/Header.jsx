import HeaderOptions from './HeaderOptions';
import HeaderUser from './HeaderUser';

function Header() {
   return (
      <header className="header fixed z-20 top-0 right-0 w-screen top-element py-2 px-20 xl:px-26 border-b flex items-center justify-end gap-5 bg-secondary dark:bg-[#1c242c] border-b-tertiary [transition:transform_0.2s,background-color_0.2s,border_0.2s] ease-in-out">
         <HeaderUser />
         <span className="text-primary-300 dark:text-primary-400">|</span>
         <HeaderOptions />
      </header>
   );
}

export default Header;
