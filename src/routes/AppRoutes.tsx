import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../pages/RootLayout.tsx";
import Home from "../pages/Home.tsx";
import CheatCardsPage from "../pages/CheatCardsPage.tsx";

const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    {index: true, element: <Home/>},
    {path: "home", element: <Navigate to="/" replace/>},
    {path: "cheat-cards", element: <CheatCardsPage/>},
    {path: "cheat-cards/:id", element: <CheatCardsPage/>},
  ],
}]);

export default routes;