import Logo from './Logo';
import Nav from './Nav';

function Sidebar() {
   return (
      <aside className="sidebar fixed z-30 h-screen py-14 px-6 border-r row-span-full space-y-10 xl:space-y-8 bg-secondary border-r-tertiary [transition:transform_0.4s,background-color_0.2s,border_0.2s] ease-in-out">
         <Logo />
         <Nav />
      </aside>
   );
}

export default Sidebar;
