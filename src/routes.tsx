import Home from "./views/Home";
import Main from "./views/Main";

const routes = [{
    name: "Main",
    path: "/",
    element: <Main/>,
}, {
    name: "Home",
    path: "/home",
    element: <Home/>,
}];

export default routes;