import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router";
import { getReturnToUrl, markLoggedIn } from "@services/tokens";
import { useEffect } from "react";
import "./index.scss";

const AuthCallback = () => {
  const { isLoading, isAuthenticated, error } = useAuth0();
  const navigate = useNavigate();

  const ERROR_MESSAGE_DEFAULT = "Invalid state";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      markLoggedIn();
      const returnTo = getReturnToUrl() || "/";
      navigate(returnTo, { replace: true });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <Box className="auth-callback-container">
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="auth-callback-container">
        <ErrorIcon className="auth-callback-icon" />
        <Typography variant="h4">Error</Typography>
        {error.message !== ERROR_MESSAGE_DEFAULT ? (
          <Typography>{error.message}</Typography>
        ) : undefined}
      </Box>
    );
  }
};

export default AuthCallback;
