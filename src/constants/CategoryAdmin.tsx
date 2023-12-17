// Trang chủ
// Đơn mới
// Đơn đang chuẩn bị
// Đơn đang giao
// Đơn giao thành công
// Đơn hoàn
// Đơn huỷ
// Quản lý kho

import Cancel from "@/app/store/seller/[MyStore]/Cancel";
import Create from "@/app/store/seller/[MyStore]/Create";
import Home from "@/app/admin/Home";
import Info from "@/app/store/seller/[MyStore]/Info";
import New from "@/app/store/seller/[MyStore]/New";
import Preparing from "@/app/store/seller/[MyStore]/Preparing";
import Rebill from "@/app/store/seller/[MyStore]/Rebill";
import Shipped from "@/app/store/seller/[MyStore]/Shipped";
import Shipping from "@/app/store/seller/[MyStore]/Shipping";
import Warehouse from "@/app/store/seller/[MyStore]/Warehouse";

export const CATEGORYADMIN = [
  {
    title: "Thống kê",
    value: "home",
    element: Home,
  },
  // {
  //   title: "Quản lý người dùng",
  //   value: "create",
  //   element: Create,
  // },
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
