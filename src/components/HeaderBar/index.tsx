import {
  AppBar,
  Avatar,
  Box,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "./Header";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import UserMenuItem from "./UserMenu/UserMenuItem";
import { useLocation } from "react-router";
import Pages from "@constants/Pages";
import TLogo from "@assets/T.svg";
import TBoard from "@assets/TT_Board.svg";
import Layouts from "@constants/Layouts";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

const HeaderBar = () => {
  // window
  const isMobile = useIsMobile();
  // auth0
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } =
    useAuth0();
  // others
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>();
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
    <AppBar key="app-bar" className={`app-bar ${onPage}`}>
      <Container maxWidth={false} disableGutters>
        <Toolbar disableGutters sx={{ height: Layouts.Header }}>
          {/* main page - board */}
          {onPage === Pages.Main && (
            <Box className="app-bar-board-container">
              <img className="app-bar-board" src={TBoard} />
            </Box>
          )}

          {/* not main page - icon */}
          {onPage !== Pages.Main && (
            <Box className="app-bar-icon">
              <Box className="app-bar-icon-container">
                <Link className="app-bar-icon-link" href={"/"} underline="none">
                  <img
                    className="app-bar-icon-svg"
                    src={TLogo}
                    alt="TravelTips"
                  />
                </Link>
              </Box>
            </Box>
          )}

          {/* headers */}
          <Box
            className={clsx("app-bar-headers-container", isMobile && "mobile")}
          >
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

          {/* auth */}
          <Box className="app-bar-auth-container">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  isMobile ? (
                    <Avatar
                      alt={username}
                      src={userPicture}
                      onClick={handleOpenUserMenu}
                    />
                  ) : (
                    <>
                      <Header
                        name={username}
                        color="primary"
                        toUpperCase={false}
                        onClick={handleOpenUserMenu}
                      />
                      <Avatar alt={username} src={userPicture} />
                    </>
                  )
                ) : (
                  <>
                    <Header
                      extraClassName="app-bar-sign-up"
                      name="sign up"
                      onClick={toAuthPortal}
                    />
                    <Typography
                      key="app-bar-login"
                      className="app-bar-login"
                      variant="h6"
                      onClick={toAuthPortal}
                    >
                      LOGIN
                    </Typography>
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
