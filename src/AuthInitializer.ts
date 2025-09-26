import { useAuth0 } from "@auth0/auth0-react";
import { setGetTokenSilentlyFn } from "@services/tokens";
import { useEffect } from "react";

export const AuthInitializer = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setGetTokenSilentlyFn(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return null;
};
