import {
  DashboardOutlined,
  BranchesOutlined,
  ProductOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

export const MenuSideBar = [
  {
    key: "/dashboard",
    icon: <BranchesOutlined />,
    label: "Asosiy",
    path: "/dashboard",
  },
  {
    key: "/nyuton-interpolation-1",
    icon: <PieChartOutlined />,
    label: "Nyutonning 1-ko'phadi",
    path: "/nyuton-interpolation-1",
  },
  {
    key: "/nyuton-interpolation-2",
    icon: <ProductOutlined />,
    label: "Nyutonning 2-ko'phadi",
    path: "/nyuton-interpolation-2",
  },
  {
    key: "/lagranj",
    icon: <DashboardOutlined />,
    label: "Lagranj",
    path: "/lagranj",
  },
];
