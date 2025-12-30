import AuthorCard from './AuthorCard';
import Logo from './Logo';
import Nav from './Nav';

// TODO: Add background gradients for each media query
// TODO: Add new shadow for embded image in CMS
// TODO: Redesign skeletons

function Sidebar() {
   return (
      <aside className="sidebar fixed z-30 h-screen py-14 px-6 border-r row-span-full border-r-quaternary/80 dark:border-r-primary-300/20 [transition:transform_0.5s,background-color_0.3s,border_0.3s] ease-in-out flex flex-col justify-around">
         <Logo />
         <Nav />
         <AuthorCard />
      </aside>
   );
}

export default Sidebar;
