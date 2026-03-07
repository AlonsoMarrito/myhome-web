import { createBrowserRouter } from "react-router-dom";

import MainView from "./App";
import Buzzon from "./views/Buzzon";
import Events from "./views/Events";
import NotFound from "./views/NotFound";
import Login from "./views/Login";
import Settings from './views/Settings'

import PrivateRoute from "./routes/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <PrivateRoute />, // PROTECCIÓN
    children: [
      {
        element: <MainView />,
        children: [
          {
            path: "/",
            element: <Buzzon />,
          },
          {
            path: "/events",
            element: <Events />,
          },
          {
            path: "/configuracion",
            element: <Settings />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;