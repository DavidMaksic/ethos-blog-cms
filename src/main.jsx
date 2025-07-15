import { ErrorBoundary } from 'react-error-boundary';
import { createRoot } from 'react-dom/client';

import ErrorFallback from './ui/ErrorFallback';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
   <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace('/')}
   >
      <App />
   </ErrorBoundary>
);
