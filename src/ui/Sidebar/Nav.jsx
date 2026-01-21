import { RiErrorWarningLine } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { useCurrentAuthor } from '../../features/authentication/useCurrentAuthor';
import { HiOutlineHashtag } from 'react-icons/hi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { createPortal } from 'react-dom';
import { useAuthors } from '../../features/authentication/useAuthors';
import { BiHomeAlt2 } from 'react-icons/bi';
import { CgMathPlus } from 'react-icons/cg';
import { LuLibrary } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { CiStar } from 'react-icons/ci';

import 'react-tooltip/dist/react-tooltip.css';

function TooltipPortal({ children }) {
   return createPortal(children, document.body);
}

const NAV_ITEMS = [
   { to: '/dashboard', label: 'Home', icon: BiHomeAlt2 },
   { to: '/new-post', label: 'New post', icon: CgMathPlus },
   { to: '/archive', label: 'Archive', icon: LuLibrary },
   {
      to: '/features',
      label: 'Features',
      icon: CiStar,
      iconClass: 'stroke-[0.6px]',
      protectedRoute: true,
   },
   {
      to: '/tags',
      label: 'Tags',
      icon: HiOutlineHashtag,
      iconClass: 'stroke-[1.6px]',
      protectedRoute: true,
   },
   { to: '/authors', label: 'Authors', icon: HiOutlineUsers },
   {
      to: '/settings',
      label: 'Settings',
      icon: IoSettingsOutline,
      protectedRoute: true,
   },
];

function Nav() {
   return (
      <nav className="space-y-2 w-53">
         {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
         ))}
      </nav>
   );
}

function NavItem({
   to,
   label,
   icon: Icon,
   iconClass = '',
   protectedRoute = false,
}) {
   const { user } = useCurrentAuthor();
   const { authors } = useAuthors();

   const currentAuthor = authors?.find((a) => a.id === user.id);
   const hasAccess = !protectedRoute || currentAuthor?.is_admin;

   const tooltipId = `tooltip-${label.replace(/\s+/g, '-')}`;

   const content = (
      <>
         <Icon className={`icons ${iconClass}`} />
         <span>{label}</span>
      </>
   );

   if (hasAccess) {
      return (
         <NavLink
            to={to}
            className={({ isActive }) =>
               isActive
                  ? 'nav-link group rounded-xl bg-gray-200/40 dark:bg-primary-300/10 !text-accent [&_svg]:!text-accent transition-bg_color'
                  : 'nav-link group transition-bg_color'
            }
         >
            {content}
         </NavLink>
      );
   }

   return (
      <>
         <div
            className="nav-link group transition-bg_color cursor-default"
            data-tooltip-id={tooltipId}
         >
            <div className="flex items-center gap-3 opacity-50">{content}</div>
         </div>

         <TooltipPortal>
            <Tooltip
               id={tooltipId}
               place="right"
               noArrow
               className="bg-white! text-primary-500! font-medium dark:bg-primary-300/20! backdrop-blur-3xl! z-30! rounded-2xl! transition-all! duration-300! ease-out! px-5! border! shadow-dashboard! dark:shadow-none! border-quaternary dark:border-primary-300/20!"
            >
               <div className="flex items-center space-x-2">
                  <RiErrorWarningLine className="stroke-[0.3px] text-xl" />
                  <span>Admins only</span>
               </div>
            </Tooltip>
         </TooltipPortal>
      </>
   );
}

export default Nav;
