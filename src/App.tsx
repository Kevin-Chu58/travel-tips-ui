import { Route, Routes, useNavigate } from "react-router";
import HeaderBar from "./components/HeaderBar";
import routes from "./routes";
import { AuthInitializer } from "./AuthInitializer";
import { Box } from "@mui/material";
import { UserBasicInitializer } from "./UserBasicInitializer";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // userAgreement is null in default
    if (user.userAgreement === false) navigate("/user-agreement");
  }, [user.userAgreement]);

  return (
    <Box id="app">
      <AuthInitializer />
      <UserBasicInitializer />
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
