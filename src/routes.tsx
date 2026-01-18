import Workshop from "@views/Workshop";
import Home from "./views/Home";
import Main from "./views/Main";
import Trip from "@views/Trip";
import Guide from "@views/Guide";
import AuthCallback from "@views/AuthCallback";
import UserAgreement from "@views/UserAgreement";
import Document from "@views/Document";
import Attraction from "@views/Attraction";

const routes = [{
    name: "Main",
    path: "/",
    element: <Main/>,
}, {
    name: "Home",
    path: "/home/*",
    element: <Home/>,
}, {
    name: "Trip",
    path: "/trip/*",
    element: <Trip/>,
}, {
    name: "Attraction",
    path: "/attraction/:attractionId",
    element: <Attraction/>,
}, {
    name: "Workshop",
    path: "/workshop/*",
    element: <Workshop/>,
}, {
    name: "Guide",
    path: "/guide",
    element: <Guide/>,
}, {
    name: "AuthCallback",
    path: "/auth/callback",
    element: <AuthCallback/>,
}, {
    name: "UserAgreement",
    path: "/user-agreement",
    element: <UserAgreement/>,
}, {
    name: "Document",
    path: "/document",
    element: <Document/>,
}];

export default routes;