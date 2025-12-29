import Header from './Header/Header';
import Logo from './Logo';
import Nav from './Nav';

// TODO: Add space between grid items
// TODO: Add background gradients for each media query

function Sidebar() {
   return (
      <aside className="sidebar fixed z-30 h-screen py-14 px-6 border-r row-span-full space-y-10 border-r-quaternary/80 dark:border-r-primary-300/20 [transition:transform_0.4s,background-color_0.2s,border_0.2s] ease-in-out grid grid-rows-[0.4fr_1fr_0.5fr]">
         <Logo />
         <Nav />
         <Header />
      </aside>
   );
}

export default Sidebar;
