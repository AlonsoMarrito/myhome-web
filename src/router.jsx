import { createBrowserRouter } from "react-router-dom";
import MainView from "./App";
import Buzzon from "./views/Buzzon";
import Events from "./views/Events";
import NotFound from "./views/NotFound";

const router = createBrowserRouter([
  {
    element: <MainView />,
    children: [
      {
        path: "/",
        element: <Buzzon />,
      },
      {
        path: "/eventos",
        element: <Events />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
