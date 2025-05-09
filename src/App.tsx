import { Route, Routes } from "react-router";
import "./App.css";
import HeaderBar from "./components/HeaderBar";
import routes from "./routes";

function App() {
  return (
    <>
      <HeaderBar/>
      <Routes>
        {routes.map(route => 
          <Route key={route.path} path={route.path} element={route.element}/>
        )}
      </Routes>
    </>
  );
}

export default App;
