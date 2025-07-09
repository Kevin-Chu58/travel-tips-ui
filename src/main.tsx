import { StrictMode, type JSX } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";
import { Provider } from "react-redux";
import { store } from "@redux/store";

let domain = import.meta.env.VITE_AUTH0_DOMAIN;
let clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
let audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const queryClient = new QueryClient();

const Auth0Layer = (): JSX.Element => {
  const onRedirectCallback = (appState?: AppState) => {
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname + window.location.search
    );
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
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
