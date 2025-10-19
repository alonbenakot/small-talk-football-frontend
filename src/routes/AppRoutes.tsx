import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../pages/RootLayout.tsx";
import Home from "../pages/Home.tsx";
import CheatCardsPage from "../pages/CheatCardsPage.tsx";
import ArticlesPage from "../pages/ArticlesPage.tsx";
import { articlesLoader } from "./loaders/ArticlesLoader.ts";
import ArticleView from "../components/features/articles/ArticleView.tsx";
import { articleLoader } from "./loaders/ArticleLoader.ts";
import { homeLoader } from "./loaders/HomeLoader.ts";
import AddArticle from "../components/features/articles/AddArticle.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import About from "../pages/AboutPage.tsx";
import { cheatCardsLoader } from "./loaders/CheatCardLoader.ts";
import MatchesPage from "../pages/MatchesPage.tsx";
import { matchesLoader } from "./loaders/MatchesLoader.ts";
import ErrorPage from "../pages/ErrorPage.tsx";
import { matchLoader } from "./loaders/MatchLoader.ts";
import MatchView from "../components/features/matches/MatchView.tsx";

const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    {
      index: true,
      element: <Home/>,
      loader: homeLoader,
      errorElement: <ErrorPage/>
    },
    {
      path: "home",
      element: <Navigate to="/" replace/>
    },
    {
      path: "cheat-cards/:id?",
      element: <CheatCardsPage/>,
      loader: cheatCardsLoader,
      errorElement: <ErrorPage/>
    },
    {
      path: "articles",
      element: <ArticlesPage/>,
      loader: articlesLoader,
      errorElement: <ErrorPage/>
    },
    {
      path: "articles/:id",
      element: <ArticleView/>,
      loader: articleLoader,
      errorElement: <ErrorPage/>
    },
    {
      path: "articles/post-article",
      element: <AddArticle/>
    },
    {
      path: "matches",
      element: <MatchesPage/>,
      loader: matchesLoader,
      errorElement: <ErrorPage/>
    },
    {
      path: "matches/:id",
      element: <MatchView/>,
      loader: matchLoader,
      errorElement: <ErrorPage/>
    },
    {
      path: "about",
      element: <About/>
    },
    {
      path: "*",
      element: <NotFoundPage/>
    },
  ],
}]);

export default routes;