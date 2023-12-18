import Home from "@/app/admin/Home";
import ManagerUser from "@/app/admin/ManagerUser";

export const CATEGORYADMIN = [
  {
    title: "Thống kê",
    value: "home",
    element: Home,
  },
  {
    title: "Quản lý người dùng",
    value: "create",
    element: ManagerUser,
  },
  // {
  //   title: "Quản lý cửa hàng",
  //   value: "new",
  //   element: New,
  // },
  // {
  //   title: "Quản lý sản phẩm",
  //   value: "preparing",
  //   element: Preparing,
  // },
];
