import { IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineHashtag } from 'react-icons/hi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { BiHomeAlt2 } from 'react-icons/bi';
import { CgMathPlus } from 'react-icons/cg';
import { LuLibrary } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';
import { CiStar } from 'react-icons/ci';

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
   return (
      <NavLink
         className={({ isActive }) =>
            isActive
               ? 'nav-link group rounded-md bg-gray-50 dark:bg-[#131c2479] !text-accent [&_svg]:!text-accent transition-bg_color'
               : 'nav-link group transition-bg_color'
         }
         to={to}
      >
         {children}
      </NavLink>
   );
}

export default Nav;
