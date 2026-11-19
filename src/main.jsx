import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'
import ToastProvider from './utils/GlobalToast';
import ConfirmationProvider from './utils/GlobalConfirmation';
import { PermissionProvider } from './contexts/PermissionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import api from './api/axios';
import { installOffline } from './offline/httpOffline';

installOffline(api);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <ConfirmationProvider>
            <PermissionProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </PermissionProvider>
          </ConfirmationProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
