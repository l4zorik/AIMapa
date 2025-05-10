/**
 * AIMapa - Inteligentní mapová aplikace
 *
 * Copyright (c) 2025 Jan Lazorik
 *
 * UPOZORNĚNÍ: Tento software je chráněn autorskými právy.
 * Neoprávněné použití tohoto kódu bude mít za následek právní postih.
 * Více informací naleznete v souboru LICENSE.md.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
