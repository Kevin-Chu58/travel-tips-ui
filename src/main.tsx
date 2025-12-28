import { StrictMode, type JSX } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import App from "./App.tsx";
import "./index.scss";

let domain = import.meta.env.VITE_AUTH0_DOMAIN;
let clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
let audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const queryClient = new QueryClient();

const Auth0Layer = (): JSX.Element => {

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: 'openid profile email offline_access',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
            </SnackbarProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    </Auth0Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Layer />
  </StrictMode>
);
