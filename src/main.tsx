import { StrictMode, type JSX } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";
import { Provider } from "react-redux";
import { store } from "@redux/store";

let domain = import.meta.env.VITE_AUTH0_DOMAIN;
let clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
let audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const Auth0Layer = (): JSX.Element => {

  const onRedirectCallback = (appState?: AppState) => {
    // window.location.href = appState?.returnTo || "/";
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname
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
        <Router>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Router>
      </Provider>
    </Auth0Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Layer />
  </StrictMode>
);
