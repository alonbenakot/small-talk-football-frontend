import { RouterProvider } from "react-router-dom";
import routes from "./routes/AppRoutes.tsx";

const App = () => {
  return <RouterProvider router={ routes }></RouterProvider>
}

export default App;
