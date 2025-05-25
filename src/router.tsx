import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import ControlPanel from "./pages/ControlPanel/ControlPanel";
import Slagalica from "./pages/Slagalica/Slagalica";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: '/control-panel', element: <ControlPanel /> },
      { path: '/slagalica', element: <Slagalica /> }
    ]
  }
]);

export default router