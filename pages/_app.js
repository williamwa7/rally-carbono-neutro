// src/pages/_app.js
import { useEffect } from 'react';
import { SSRProvider } from 'react-bootstrap';
import { DatabaseProvider } from '../src/contexts/DatabaseContext';
import { GeneralProvider } from '../src/contexts/GeneralContext';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  // Registrar service worker para funcionalidade offline
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js').then(
          function (registration) {
            console.log('Service Worker registrado com sucesso:', registration.scope);
          },
          function (err) {
            console.log('Falha no registro do Service Worker:', err);
          }
        );
      });
    }
  }, []);

  return (
    <SSRProvider>
      <DatabaseProvider>
        <GeneralProvider>
          <Component {...pageProps} />
        </GeneralProvider>
      </DatabaseProvider>
    </SSRProvider>
  );
}

export default MyApp;