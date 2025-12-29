import { RiErrorWarningLine } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { useCurrentAuthor } from '../features/authentication/useCurrentAuthor';
import { HiOutlineHashtag } from 'react-icons/hi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { useAuthors } from '../features/authentication/useAuthors';
import { BiHomeAlt2 } from 'react-icons/bi';
import { CgMathPlus } from 'react-icons/cg';
import { LuLibrary } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { CiStar } from 'react-icons/ci';
import 'react-tooltip/dist/react-tooltip.css';

function Nav() {
   return (
      <nav className="space-y-2 w-53">
         <NavItem to="/dashboard">
            <BiHomeAlt2 className="icons" />
            <span>Home</span>
         </NavItem>

         <NavItem to="/new-post">
            <CgMathPlus className="icons" />
            <span>New post</span>
         </NavItem>

         <NavItem to="/archive">
            <LuLibrary className="icons" />
            <span>Archive</span>
         </NavItem>

         <NavItem to="/features">
            <CiStar className="icons stroke-[0.6px]" />
            <span>Features</span>
         </NavItem>

         <NavItem to="/tags">
            <HiOutlineHashtag className="icons stroke-[1.6px]" />
            <span>Tags</span>
         </NavItem>

         <NavItem to="/authors">
            <HiOutlineUsers className="icons" />
            <span>Authors</span>
         </NavItem>

         <NavItem to="/settings">
            <IoSettingsOutline className="icons" />
            <span>Settings</span>
         </NavItem>
      </nav>
   );
}

function NavItem({ to, children }) {
   const protectedRoutes =
      to === '/features' || to === '/tags' || to === '/settings';

   const { user } = useCurrentAuthor();
   const { authors } = useAuthors();
   const currentAuthor = authors?.find((item) => item.id === user.id);

   const hasAccess = !protectedRoutes || currentAuthor?.is_admin;

   return (
      <>
         {hasAccess ? (
            <NavLink
               className={({ isActive }) =>
                  isActive
                     ? 'nav-link group rounded-xl bg-gray-100 dark:bg-primary-300/10 !text-accent [&_svg]:!text-accent transition-bg_color'
                     : `nav-link group transition-bg_color`
               }
               to={to}
            >
               {children}
            </NavLink>
         ) : (
            <>
               <div className="nav-link group transition-bg_color my-tooltip opacity-50 cursor-default">
                  {children}
               </div>

               <Tooltip
                  anchorSelect=".my-tooltip"
                  place="right"
                  noArrow={true}
                  className="bg-white! text-primary-500! font-medium dark:bg-[#29323A]! rounded-2xl! transition-all! duration-300! ease-out! px-5! border! border-quaternary dark:border-primary-300/20!"
               >
                  <div className="flex items-center space-x-2">
                     <RiErrorWarningLine className="stroke-[0.3px] text-xl" />
                     <span>Admins only</span>
                  </div>
               </Tooltip>
            </>
         )}
      </>
   );
}

export default Nav;
