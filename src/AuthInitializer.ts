import { useAuth0 } from "@auth0/auth0-react";
import {
  setGetTokenSilentlyFn,
  setGoToLoginPortalFn,
  setLoginFn,
  setLogoutFn,
} from "@services/tokens";
import { useEffect } from "react";

export const AuthInitializer = () => {
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, logout } =
    useAuth0();

  useEffect(() => {
    setGetTokenSilentlyFn(getAccessTokenSilently);

    const returnToUrl =
      window.location.pathname !== "/auth/callback"
        ? window.location.pathname + window.location.search
        : "/";

    const goToLoginPortalFn = async () =>
      loginWithRedirect({
        authorizationParams: {
          prompt: "login",
          screen_hint: "profile",
        },
        appState: { returnTo: returnToUrl },
      });

    setGoToLoginPortalFn(goToLoginPortalFn);

    const loginFn = async () =>
      loginWithRedirect({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          redirect_uri: window.location.origin + "/auth/callback",
        },
        appState: { returnTo: returnToUrl },
      });

    setLoginFn(loginFn);
    setLogoutFn(logout);
  }, [getAccessTokenSilently, isAuthenticated]);

  return null;
};
