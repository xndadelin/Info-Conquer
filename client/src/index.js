import React from 'react';
import {createRoot} from 'react-dom/client'
import './index.css';
import App from './App';
import { NextUIProvider } from "@nextui-org/react";
import client from './apolloclient';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n';
const app = createRoot(document.getElementById('root'));
app.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <NextUIProvider>
          <UserProvider>
            <I18nextProvider i18n={i18n} defaultNS={'translation'}>
              <App />
            </I18nextProvider>
          </UserProvider>
        </NextUIProvider>
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>
);
