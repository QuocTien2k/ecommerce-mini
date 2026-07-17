import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { setupInterceptors } from "./shared/api/interceptors.ts";
import { bootstrapAuth } from "@app/bootstrap.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@lib/react-query.ts";
import SocketProvider from "./providers/SocketProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

setupInterceptors();
bootstrapAuth().finally(() => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <SocketProvider>
                <App />
              </SocketProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </Provider>
    </StrictMode>,
  );
});
