import {
  AppBar,
  Box,
  Container,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "./Header";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { useLocation } from "react-router";
import Pages from "@constants/Pages";
import TLogo from "@assets/T.svg";
import TBoard from "@assets/TT_Board.svg";
import Layouts from "@constants/Layouts";
import { useIsMobile } from "@hooks/useIsMobile";
import { login, logout } from "@services/tokens";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import UserAvatar from "@components/UserAvatar";
import type { HeaderTab, NavTab } from "@constants/Types";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import HandshakeIcon from '@mui/icons-material/Handshake';
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import ArticleIcon from '@mui/icons-material/Article';
// import TokenIcon from '@mui/icons-material/Token';
// import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import clsx from "clsx";
import "./index.scss";

const HeaderBar = () => {
  // window
  const isMobile = useIsMobile();
  // auth0
  const { isLoading, isAuthenticated } = useAuth0();
  // user
  const user = useSelector((state: RootState) => state.user);
  const userSimple = {
    id: user.id ?? 0,
    userId: user.userId ?? "",
    username: user.username ?? "",
    picture: user.picture ?? "",
  };
  // anchors
  const [anchorElHeader, setAnchorElHeader] = useState<HTMLElement | null>(); // header menu
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(); // user menu
  // const [anchorElMore, setAnchorElMore] = useState<HTMLElement | null>();
  // others
  const location = useLocation();
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
      name: "Gospel",
      to: "/gospel",
      requireAuth: false,
    },
    {
      name: "doc",
      to: "/doc",
      // element: <ArticleIcon fontSize="small" />,
    },
    {
      name: "membership",
      to: "/membership",
      // element: <TokenIcon fontSize="small" />,
    },
  ] as HeaderTab[];

  const currentHeader =
    headers.find((h) => location.pathname.startsWith(h.to))?.name ??
    (onPage ? "Main" : "");

  const handleLogout = async () => {
    await logout();
  };

  // const moreMenuItems = [
  //   {
  //     name: "membership",
  //     to: "/membership",
  //     // element: <TokenIcon fontSize="small" />,
  //   },
  //   {
  //     name: "documentation",
  //     to: "/doc",
  //     // element: <ArticleIcon fontSize="small" />,
  //   },
  // ] as HeaderTab[];

  const userMenuItems = [
    {
      name: "profile",
      to: "/profile",
      element: <AccountBoxIcon fontSize="small" />,
    },
    {
      name: "subscription",
      to: "/subscription",
      element: <LocalActivityIcon fontSize="small" />,
    },
    {
      name: "banner",
      to: "/banners",
      element: <ViewCarouselIcon fontSize="small" />,
      condition: user.isAdmin,
    },
    {
      name: "partnership",
      to: "/partnership",
      element: <HandshakeIcon fontSize="small" />,
    },
    // {
    //   name: "setting",
    //   to: "/settings",
    //   element: <SettingsIcon fontSize="small" />,
    // },
    {
      name: "logout",
      to: "",
      element: <LogoutIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ] as NavTab[];

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

  // const handleOpenMoreMenu = (e: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElMore(e.currentTarget);
  // };

  // const handleCloseMoreMenu = () => {
  //   setAnchorElMore(null);
  // };

  const toAuthPortal = async () => {
    await login();
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
                    Boolean(anchorElHeader) && "focus",
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
                    // .concat(moreMenuItems)
                    .filter(
                      (h) =>
                        !h.requireAuth || (h.requireAuth && isAuthenticated),
                    )
                    .map((h) => (
                      <Link className="TT-menu-link" key={h.name} href={h.to}>
                        <MenuItem>{h.name}</MenuItem>
                      </Link>
                    ))}
                </Menu>
              </Box>
            ) : (
              <Box
                className={clsx("app-bar-headers-container", onPage === Pages.Main && "main")}
              >
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
                    ),
                )}

                {/* more button - trigger on hover */}
                {/* <Box>
                  <IconButton
                    className="app-bar-more-button"
                    onClick={(e) => handleOpenMoreMenu(e)}
                    disableRipple
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Box> */}

                {/* <Menu
                  className="TT-menu flex"
                  open={Boolean(anchorElMore)}
                  anchorEl={anchorElMore}
                  onClose={handleCloseMoreMenu}
                >
                  {moreMenuItems.map((item) => (
                    <Link key={item.name} href={item.to}>
                      <MenuItem>{item.name}</MenuItem>
                    </Link>
                  ))}
                </Menu> */}
              </Box>
            )
          ) : undefined}

          {/* auth */}
          <Box className="app-bar-auth-container">
            {!isLoading ? (
              <React.Fragment>
                {isAuthenticated ? (
                  isMobile ? (
                    <UserAvatar
                      user={userSimple}
                      onClick={handleOpenUserMenu}
                    />
                  ) : (
                    <React.Fragment>
                      <Header
                        name={user?.username ?? ""}
                        color="primary"
                        toUpperCase={false}
                        onClick={handleOpenUserMenu}
                        enableHighlight
                        hasLimit
                      />
                      <UserAvatar user={userSimple} />
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
            {userMenuItems.map((item) =>
              item.condition !== false ? (
                <Link key={item.name} href={item.to} onClick={item.onClick}>
                  <MenuItem>
                    <ListItemIcon>{item.element}</ListItemIcon>
                    {item.name}
                  </MenuItem>
                </Link>
              ) : undefined,
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderBar;
