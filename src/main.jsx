import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { StoreProvider } from './context/StoreContext';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
            style={{
              width: "100%",
              left: 0,
              transform: "none",
            }}
          />
        </BrowserRouter>
      </StoreProvider>
    </QueryClientProvider>
  </StrictMode>,
);
