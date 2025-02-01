import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout.tsx";
import Home from "../pages/Home.tsx";

const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    {index: true, element: <Home/>},
  ],
}]);

export default routes;