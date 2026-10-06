import { createRoot } from 'react-dom/client';
import { App } from './web/app/App';
import { ErrorBoundary } from './web/components/ui/ErrorBoundary';
import './web/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
