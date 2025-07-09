import { Route, Routes, useNavigate } from "react-router";
import HeaderBar from "./components/HeaderBar";
import routes from "./routes";
import { AuthInitializer } from "./AuthInitializer";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Box } from "@mui/material";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // rerender to the correct page when login
  useEffect(() => {
    if (!isLoading && isAuthenticated)
      navigate(window.location.pathname + window.location.search);
  }, [isLoading, isAuthenticated]);

  return (
    <Box id="app">
      <AuthInitializer />
      <HeaderBar />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Box>
  );
}

export default App;
