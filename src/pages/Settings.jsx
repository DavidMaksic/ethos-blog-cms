import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import UpdateSettings from '../features/settings/UpdateSettings';
import SettingsForm from '../ui/Form/SettingsForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Settings() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <>
         <Row type="horizontal">
            <Heading type="h1">Settings</Heading>
         </Row>

         <Row>
            <UpdateSettings>
               <SettingsForm />
            </UpdateSettings>
         </Row>
      </>
   );
}

export default Settings;
