import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalProvider } from './providers/GlobalStateProvider';
import App from './components/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
);
