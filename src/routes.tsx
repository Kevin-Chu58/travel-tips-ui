import Workshop from "@views/Workshop";
import Home from "./views/Home";
import Main from "./views/Main";
import Trip from "@views/Trip";
import Guide from "@views/Guide";
import AuthCallback from "@views/AuthCallback";
import UserAgreement from "@views/UserAgreement";

const routes = [{
    name: "Main",
    path: "/",
    element: <Main/>,
}, {
    name: "Home",
    path: "/home",
    element: <Home/>,
}, {
    name: "Trip",
    path: "/trip/*",
    element: <Trip/>,
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
}];

export default routes;