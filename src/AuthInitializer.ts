import { useAuth0 } from "@auth0/auth0-react";
import { setGetTokenSilentlyFn, setLogoutFn } from "@services/tokens";
import { useEffect } from "react";

export const AuthInitializer = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    setGetTokenSilentlyFn(getAccessTokenSilently);
    setLogoutFn(logout);
  }, [getAccessTokenSilently]);

  return null;
};
