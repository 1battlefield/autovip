import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Không cần import CSS ở đây vì đã import trong App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);