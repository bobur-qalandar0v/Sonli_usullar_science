import Dashboard from "../pages/Dashboard/Dashboard";
import LagrangeInterpolation from "../pages/Lagranj/Lagranj";
import NewtonInterpolation from "../pages/Nyuton1/Nyuton1";
import Nyuton2 from "../pages/Nyuton2/Nyuton2";

export const routes = [
  {
    id: 1,
    element: <Dashboard />,
    path: "/",
  },
  {
    id: 2,
    element: <NewtonInterpolation />,
    path: "/nyuton-interpolation-1",
  },
  {
    id: 3,
    element: <Nyuton2 />,
    path: "/nyuton-interpolation-2",
  },
  {
    id: 4,
    element: <LagrangeInterpolation />,
    path: "/lagranj",
  },
];
