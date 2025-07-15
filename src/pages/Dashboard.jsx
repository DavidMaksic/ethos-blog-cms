import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import DashboardFilter from '../features/dashboard/DashboardFilter';
import DashboardLayout from '../features/dashboard/DashboardLayout';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Dashboard() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">Dashboard</Heading>
            <DashboardFilter />
         </Row>
         <DashboardLayout />
      </>
   );
}

export default Dashboard;
