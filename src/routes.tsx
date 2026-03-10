import Workshop from "@views/Workshop";
import Home from "./views/Home";
import Main from "./views/Main";
import Trip from "@views/Trip";
import Doc from "@views/Doc";
import AuthCallback from "@views/AuthCallback";
import UserAgreement from "@views/UserAgreement";
import Attraction from "@views/Attraction";
import Gospel from "@views/Gospel";
import Profile from "@views/Profile";
import Settings from "@views/Settings";
import EmailUnverified from "@views/EmailUnverified";
import Banner from "@views/Banner";

const routes = [
  {
    name: "Main",
    path: "/",
    element: <Main />,
  },
  {
    name: "Home",
    path: "/home/*",
    element: <Home />,
  },
  {
    name: "Trip",
    path: "/trip/*",
    element: <Trip />,
  },
  {
    name: "Attraction",
    path: "/attraction/:attractionId",
    element: <Attraction />,
  },
  {
    name: "Workshop",
    path: "/workshop/*",
    element: <Workshop />,
  },
  {
    name: "Doc",
    path: "/doc/*",
    element: <Doc />,
  },
  {
    name: "Gospel",
    path: "/gospel/*",
    element: <Gospel />,
  },
  {
    name: "Profile",
    path: "/profile/*",
    element: <Profile />,
  },
  {
    name: "Banner",
    path: "/banners",
    element: <Banner />,
  },
  {
    name: "Settings",
    path: "/settings",
    element: <Settings />,
  },
  {
    name: "AuthCallback",
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    name: "UserAgreement",
    path: "/user-agreement",
    element: <UserAgreement />,
  },
  {
    name: "EmailUnverified",
    path: "/email-unverified",
    element: <EmailUnverified />,
  },
];

export default routes;
