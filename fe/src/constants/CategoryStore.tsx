// Trang chủ
// Đơn mới
// Đơn đang chuẩn bị
// Đơn đang giao
// Đơn giao thành công
// Đơn hoàn
// Đơn huỷ
// Quản lý kho

import Cancel from "@/app/store/[MyStore]/Cancel";
import Create from "@/app/store/[MyStore]/Create";
import Home from "@/app/store/[MyStore]/Home";
import New from "@/app/store/[MyStore]/New";
import Preparing from "@/app/store/[MyStore]/Preparing";
import Rebill from "@/app/store/[MyStore]/Rebill";
import Shipped from "@/app/store/[MyStore]/Shipped";
import Shipping from "@/app/store/[MyStore]/Shipping";
import Warehouse from "@/app/store/[MyStore]/Warehouse";

export const CATEGORYSTORE = [
  {
    title: "Trang chủ",
    value: "home",
    element: Home,
  },
  {
    title: "Tạo sản phẩm",
    value: "create",
    element: Create,
  },
  {
    title: "Đơn mới",
    value: "new",
    element: New,
  },
  {
    title: "Đơn đang chuẩn bị",
    value: "preparing",
    element: Preparing,
  },
  {
    title: "Đơn đang giao",
    value: "shipping",
    element: Shipping,
  },
  {
    title: "Đơn giao thành công",
    value: "shipped",
    element: Shipped,
  },
  {
    title: "Đơn hoàn",
    value: "rebill",
    element: Rebill,
  },
  {
    title: "Đơn huỷ",
    value: "cancel",
    element: Cancel,
  },
  {
    title: "Quản lý kho",
    value: "warehouse",
    element: Warehouse,
  },
];
