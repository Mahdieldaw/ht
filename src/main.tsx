/**
 * Main entry point for the React application.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/global.css'; // Import global styles (for Tailwind setup)

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element. Make sure your HTML has <div id='root'></div>.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
