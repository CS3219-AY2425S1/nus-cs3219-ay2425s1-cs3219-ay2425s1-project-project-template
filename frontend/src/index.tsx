import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Create a root element to render your app into
const rootElement = document.getElementById('root') as HTMLElement;

// Create a root with ReactDOM's new API for React 18+
const root = ReactDOM.createRoot(rootElement);

// Render the app inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);