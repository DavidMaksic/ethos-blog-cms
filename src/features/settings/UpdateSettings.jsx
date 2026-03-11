import { useLocation } from 'react-router-dom';

function UpdateSettings({ children }) {
   const { pathname } = useLocation();

   return (
      <div
         className={`bg-white dark:bg-primary-300/10 rounded-2xl px-10 transition-bg_border box-shadow transition-200 ${pathname === '/tags' ? 'self-start' : ''}`}
      >
         {children}
      </div>
   );
}

export default UpdateSettings;
