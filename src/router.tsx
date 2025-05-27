import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import ControlPanel from "./pages/ControlPanel/ControlPanel";
import Slagalica from "./pages/Slagalica/Slagalica";
import MojBroj from "./pages/MojBroj/MojBroj";
import Spajalica from "./pages/Spajalica/Spajalica";

const router = createBrowserRouter([
  {
    path: '/slagalica-build',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: '/slagalica-build/control-panel', element: <ControlPanel /> },
      { path: '/slagalica-build/slagalica', element: <Slagalica /> },
      { path: '/slagalica-build/moj-broj', element: <MojBroj />},
      { path: '/slagalica-build/spajalica', element: <Spajalica />}
    ]
  }
]);

export default router