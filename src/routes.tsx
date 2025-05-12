import Home from "./views/Home";
import Main from "./views/Main";
import Trip from "./views/Trip";

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
}];

export default routes;