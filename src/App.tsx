import { Route, Routes, useNavigate } from "react-router";
import { AuthInitializer } from "./AuthInitializer";
import { Box } from "@mui/material";
import { UserBasicInitializer } from "./UserBasicInitializer";
import GuestAgreementForm from "@components/Forms/GuestAgreementForm";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { useEffect, useState } from "react";
import HeaderBar from "./components/HeaderBar";
import routes from "./routes";
import { LS_GUEST_USER_AGREEMENT } from "@constants/localStorage";

function App() {
  // user
  const user = useSelector((state: RootState) => state.user);
  // guest
  const guestUserAgreement = localStorage.getItem(LS_GUEST_USER_AGREEMENT);
  // form
  const [openGuestAgreement, setOpenGuestAgreement] = useState<boolean>(false);
  // others
  const navigate = useNavigate();

  useEffect(() => {
    // userAgreement is null in default
    if (user.userAgreement === false) navigate("/user-agreement");
  }, [user.userAgreement]);

  useEffect(() => {
    if (user.isLoading) return;

    if (!user.isLoading && !user.id && guestUserAgreement !== "true") {
      setOpenGuestAgreement(true);
    }
  }, [user.isLoading, guestUserAgreement]);

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

      {/* forms */}
      <GuestAgreementForm
        open={openGuestAgreement}
        setOpen={setOpenGuestAgreement}
      />
    </Box>
  );
}

export default App;
