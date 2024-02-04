import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NextUIProvider } from "@nextui-org/react";
import client from './apolloclient'
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <NextUIProvider>
            <UserProvider>
              <App />
            </UserProvider>
        </NextUIProvider>
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>
);
