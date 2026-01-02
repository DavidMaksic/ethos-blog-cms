import { useFullscreen } from '../context/FullscreenContext';
import { useEffect } from 'react';

import UpdateSettings from '../features/settings/UpdateSettings';
import SettingsForm from '../ui/Forms/SettingsForm';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Settings() {
   const { setIsFullscreen } = useFullscreen();
   useEffect(() => setIsFullscreen(false), [setIsFullscreen]);

   return (
      <div className="-translate-y-20 flex flex-col gap-8 my-auto">
         <Row type="horizontal">
            <Heading type="h1">Settings</Heading>
         </Row>

         <Row>
            <UpdateSettings>
               <SettingsForm />
            </UpdateSettings>
         </Row>
      </div>
   );
}

export default Settings;
