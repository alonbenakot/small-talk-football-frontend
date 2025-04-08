import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout.tsx";
import Home from "../pages/Home.tsx";
import CheatCardsPage from "../pages/CheatCardsPage.tsx";

const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    {index: true, element: <Home/>},
    {path: "home", element: <Home/>},
    {path: "cheat-cards", element: <CheatCardsPage/>},
  ],
}]);

export default routes;