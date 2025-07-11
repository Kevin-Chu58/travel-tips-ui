import {
  AppBar,
  Avatar,
  Box,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import "./index.scss";
import Header from "./Header";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import UserMenuItem from "./UserMenu/UserMenuItem";
import { useLocation } from "react-router";
import Pages from "@constants/Pages";
import TTSearch from "@components/TTSearch";
import TLogo from "@assets/T.svg";
import TBoard from "@assets/TT_Board.svg";
import Layouts from "@constants/Layouts";

const HeaderBar = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } =
    useAuth0();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>();
  const location = useLocation();
  const onPage = location.pathname === "/" ? Pages.Main : Pages.Undefined;

  // render on mount
  useEffect(() => {}, []);

  const headers = [
    {
      name: "home",
      to: "/home",
      requireAuth: false,
    },
    {
      name: "workshop",
      to: "/workshop",
      requireAuth: true,
    },
  ];
  const userMenuItems = [
    {
      name: "profile",
      to: "/profile",
    },
    {
      name: "setting",
      to: "/setting",
    },
    {
      name: "logout",
      to: "",
      onClick: logout,
    },
  ];

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const username = user?.name ?? "";
  const userPicture = user?.picture ?? "";

  const toAuthPortal = () =>
    loginWithRedirect({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin,
      },
      appState: { returnTo: window.location.pathname },
    });

  return (
    <AppBar
      key="app-bar"
      className={`app-bar ${onPage}`}
      position="sticky"
      sx={{ width: {sx: "none", md: "100vw"} }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar disableGutters sx={{ height: Layouts.Header }}>
          {/* main page - board */}
          {onPage === Pages.Main && (
            <Box mt={20} ml={-5} mr={-20}>
              <img src={TBoard} height={200} />
            </Box>
          )}

          {/* not main page - icon */}
          {onPage !== Pages.Main && (
            <Box
              className="app-bar-icon"
              height="inherit"
              alignItems="center"
              display="flex"
            >
              <Box
                bgcolor="primary.main"
                height="inherit"
                alignItems="center"
                display="flex"
                px={0.5}
              >
                <Link href={"/"}>
                  <img
                    className="app-bar-icon-svg"
                    src={TLogo}
                    alt="TravelTips"
                    height={60}
                    width={60}
                  />
                </Link>
              </Box>
            </Box>
          )}

          {/* headers */}
          <Box display="flex" flexDirection="row" ml={{ md: 10, lg: 20 }}>
            {headers.map(
              (header, i) =>
                (isAuthenticated || !header.requireAuth) && (
                  <Header
                    key={`app-bar-header-${i}`}
                    name={header.name}
                    to={header.to}
                  />
                )
            )}
          </Box>

          {/* main page - quick search */}
          {onPage === Pages.Main && (
            <Box m={2}>
              <TTSearch
                color="white"
                autoFocus={true}
                sx={{
                  ".MuiInput-root": {
                    color: "white",
                    ".MuiInputBase-input": {
                      width: "90%",
                    },
                    "&::after": {
                      borderBottom: "2px solid white",
                      transform: "scaleX(1) translateX(0)",
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* auth */}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            ml="auto"
            mr={3}
          >
            {!isLoading && (
              <>
                {!isAuthenticated && (
                  <>
                    <Header name="sign up" onClick={toAuthPortal} />
                    <Typography
                      key="app-bar-login"
                      className="app-bar-login"
                      variant="h6"
                      color="primary"
                      borderColor="primary"
                      borderRadius={2}
                      m={2}
                      px={3}
                      py={0.2}
                      sx={{
                        ":hover": {
                          color: "white",
                          bgcolor: "primary",
                        },
                      }}
                      onClick={toAuthPortal}
                    >
                      LOGIN
                    </Typography>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Header
                      name={username}
                      color="primary"
                      toUpperCase={false}
                      onClick={handleOpenUserMenu}
                    />
                    <Avatar alt={username} src={userPicture} />
                  </>
                )}
              </>
            )}
          </Box>

          <UserMenu anchor={anchorElUser} onClose={handleCloseUserMenu}>
            {userMenuItems.map((item, i) => (
              <UserMenuItem
                key={`app-bar-user-menu-item-${i}`}
                name={item.name}
                to={item.to}
                onClick={item.onClick}
                focusColor="primary.main"
              />
            ))}
          </UserMenu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderBar;
