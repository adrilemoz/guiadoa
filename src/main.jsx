import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Fontes locais (offline) — pesos usados pelo tema Nunito
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/900.css';
// Nota: ícones agora servidos via @mui/icons-material (tree-shakeable)

// Service Worker PWA
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
