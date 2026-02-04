import {
  AppBar,
  Avatar,
  Box,
  Container,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "./Header";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Pages from "@constants/Pages";
import TLogo from "@assets/T.svg";
import TBoard from "@assets/TT_Board.svg";
import Layouts from "@constants/Layouts";
import { useIsMobile } from "@hooks/useIsMobile";
import { markLoggedOut, setReturnToUrl } from "@services/tokens";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import clsx from "clsx";
import "./index.scss";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";

const HeaderBar = () => {
  // window
  const isMobile = useIsMobile();
  // auth0
  const { isLoading, isAuthenticated, loginWithRedirect, logout } =
    useAuth0();
  // user
  const user = useSelector((state: RootState) => state.user);
  // others
  const location = useLocation();
  const [anchorElHeader, setAnchorElHeader] = useState<HTMLElement | null>(); // header menu
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(); // user menu
  const onPage = location.pathname === "/" ? Pages.Main : Pages.Undefined;

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
    {
      name: "Doc",
      to: "/doc",
      requireAuth: false,
    },
    {
      name: "Gospel",
      to: "/gospel",
      requireAuth: false,
    },
  ];

  const currentHeader =
    headers.find((h) => location.pathname.startsWith(h.to))?.name ??
    (onPage ? "Main" : "");

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
      onClick: () => {
        logout();
        markLoggedOut();
      },
    },
  ];

  // anchoring menu

  const handleOpenHeaderMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElHeader(e.currentTarget);
  };

  const handleCloseHeaderMenu = () => {
    setAnchorElHeader(null);
  };

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const username = user?.username ?? "";
  const userPicture = user?.picture ?? "";

  const returnToUrl =
    window.location.pathname !== "/auth/callback"
      ? window.location.pathname + window.location.search
      : "/";

  useEffect(() => {
    setReturnToUrl(returnToUrl);
  }, [returnToUrl]);

  const toAuthPortal = () => {
    loginWithRedirect({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin + "/auth/callback",
      },
      appState: { returnTo: returnToUrl },
    });
  };

  return (
    <AppBar key="app-bar" className={`app-bar ${onPage}`}>
      <Container maxWidth={false} disableGutters>
        <Toolbar disableGutters sx={{ height: Layouts.Header }}>
          {/* main page - board */}
          {onPage === Pages.Main && !isMobile && (
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
          {!isLoading ? (
            isMobile ? (
              <Box>
                {/* current header */}
                <Box
                  className={clsx(
                    "app-bar-headers-container mobile",
                    Boolean(anchorElHeader) && "focus"
                  )}
                  onClick={handleOpenHeaderMenu}
                >
                  <Header name={currentHeader} />
                  {Boolean(anchorElHeader) ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </Box>

                {/* header menu */}
                <Menu
                  className="TT-menu"
                  anchorEl={anchorElHeader}
                  open={Boolean(anchorElHeader)}
                  onClose={handleCloseHeaderMenu}
                >
                  {headers
                    .filter(
                      (h) =>
                        !h.requireAuth || (h.requireAuth && isAuthenticated)
                    )
                    .map((h) => (
                      <Link className="TT-menu-link" key={h.name} href={h.to}>
                        <MenuItem>{h.name}</MenuItem>
                      </Link>
                    ))}
                </Menu>
              </Box>
            ) : (
              <Box className="app-bar-headers-container">
                {headers.map(
                  (header, i) =>
                    (isAuthenticated || !header.requireAuth) && (
                      <Header
                        key={`app-bar-header-${i}`}
                        name={header.name}
                        to={header.to}
                        focus={header.name === currentHeader}
                        enableHighlight
                      />
                    )
                )}
              </Box>
            )
          ) : undefined}

          {/* auth */}
          <Box className="app-bar-auth-container">
            {!isLoading ? (
              <React.Fragment>
                {isAuthenticated ? (
                  isMobile ? (
                    <Avatar
                      alt={username}
                      src={userPicture}
                      onClick={handleOpenUserMenu}
                    />
                  ) : (
                    <React.Fragment>
                      <Header
                        name={username}
                        color="primary"
                        toUpperCase={false}
                        onClick={handleOpenUserMenu}
                        enableHighlight
                      />
                      <Avatar alt={username} src={userPicture} />
                    </React.Fragment>
                  )
                ) : (
                  <Typography
                    className="app-bar-login"
                    variant="h6"
                    onClick={toAuthPortal}
                  >
                    SIGN IN
                  </Typography>
                )}
              </React.Fragment>
            ) : undefined}
          </Box>

          <Menu
            className="TT-menu flex"
            open={Boolean(anchorElUser)}
            anchorEl={anchorElUser}
            onClose={handleCloseUserMenu}
          >
            {userMenuItems.map((item) => (
              <Link key={item.name} href={item.to} onClick={item.onClick}>
                <MenuItem>{item.name}</MenuItem>
              </Link>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderBar;
