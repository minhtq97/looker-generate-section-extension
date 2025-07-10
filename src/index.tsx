import React from 'react';
import ReactDOM from 'react-dom';
import { ExtensionProvider } from '@looker/extension-sdk-react';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ExtensionProvider loadingComponent={<div>Loading...</div>} requiredLookerVersion=">=22.0.0">
      <App />
    </ExtensionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
