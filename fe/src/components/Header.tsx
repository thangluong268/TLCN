"use client";
import Link from "next/link";
import React from "react";
import {
  FaComments,
  FaBell,
  FaCartPlus,
  FaSistrix,
  FaStore,
} from "react-icons/fa";
import FramePopup from "./FramePopup";
import {
  APIGetAllNotification,
  APIUpdateNotification,
} from "@/services/Notification";
import { UserInterface } from "@/types/User";
import Notification from "./Notification";
import { APIGetAllCart } from "@/services/Cart";
import { Cart, Order } from "@/types/Cart";
import { APIGetMyStore } from "@/services/Store";
import { setCartPopUp } from "@/redux/features/cart/cartpopup-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import FormatMoney from "@/utils/FormatMoney";
import { UserAuth } from "@/app/authContext";
import { redirect } from "next/navigation";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const [dataNoti, setDataNoti] = React.useState([]);
  const { logOut } = UserAuth();

  const [user, setUser] = React.useState<UserInterface>();
  const [isShowCart, setIsShowCart] = React.useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState("");
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "")
      : null;

    // Nếu role là admin và đang ở trang khác có pathname khác /admin thì redirect về trang admin
    if (
      user?.role == "Admin" &&
      !window.location.pathname.startsWith("/admin")
    ) {
      redirect("/admin");
    } else if (
      user?.role == "Manager_Product" &&
      !window.location.pathname.startsWith("/manager/product")
    ) {
      redirect("/manager/product");
    } else if (
      user?.role == "Manager_Store" &&
      !window.location.pathname.startsWith("/manager/store")
    ) {
      redirect("/manager/store");
    } else if (
      user?.role == "Manager_User" &&
      !window.location.pathname.startsWith("/manager/user")
    ) {
      redirect("/manager/user");
    } else {
      if (
        (user?.role == "User" || user?.role == "User - Seller") &&
        (window.location.pathname.startsWith("/admin") ||
          window.location.pathname.startsWith("/manager"))
      ) {
        redirect("/");
      } else {
        setUser(user?.providerData[0]);
        setRole(user?.role);
        const fetchAllCart = async () => {
          const res = await APIGetAllCart();
          var total = 0;
          if (res.status == 200 || res.status == 201) {
            const carts: Cart = {
              isCheckAll: false,
              store: res.metadata.data.map((item: any) => {
                return {
                  id: item.storeId,
                  name: item.storeName,
                  isChecked: false,
                  avatar: item.storeAvatar,
                  product: item.listProducts.map((product: any) => {
                    total += 1;
                    return {
                      id: product.productId,
                      name: product.productName,
                      avatar: product.avatar[0],
                      type: product.type,
                      price: product.price,
                      quantity: product.quantity,
                      quantityInStock: product.quantityInStock,
                      isChecked: false,
                    };
                  }),
                };
              }),
            };
            console.log("carts", carts);
            dispatch(setCartPopUp(carts));
          }
        };

        if (user) {
          fetchAllCart();
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    const fetchAllNoti = async () => {
      const res = await APIGetAllNotification({
        page: 1,
        limit: 10,
      });
      if (res.status == 200 || res.status == 201) {
        setDataNoti(res.metadata.data.notifications);
        setCountNewNoti(
          res.metadata.data.notifications.filter(
            (item: any) => item.status == false
          ).length
        );
      }
    };
    if (user && user.role != "Admin") {
      fetchAllNoti();
    }
  }, []);
  React.useEffect(() => {
    if (window.location.pathname == "/cart") {
      setIsShowCart(false);
    } else {
      setIsShowCart(true);
    }
  }, []);

  const profileToggleDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const OpenStore = async () => {
    const store = await APIGetMyStore();
    if (store.status == 200 || store.status == 201) {
      window.location.href = "/shop/seller/" + store.metadata.data._id;
    } else {
      window.location.href = "/shop/create";
    }
  };
  return (
    <>
      {(role == "User" || role == "User - Seller" || !role) && (
        <header className="h-[60px]">
          <div className="flex justify-between items-center w-full h-[60px] bg-[#D2E0FB] px-[10%] fixed top-0 left-0 right-0 z-10">
            <img
              className="cursor-pointer w-[8%]"
              src="/logo.png"
              alt="Loading..."
              onClick={() => {
                window.location.href = "/";
              }}
            />

            {user && (
              <div className="flex items-center rounded-3xl w-[400px] h-[40px] bg-[#E1E9F7] px-2">
                <div className="p-2">
                  <FaSistrix className="w-[24px] h-[24px] hover:cursor-pointer" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  className="flex-1 h-full outline-none bg-transparent"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      window.location.href = "/product/search?search=" + search;
                    }
                  }}
                />
              </div>
            )}

            {user && (
              <>
                <div className="flex items-center cursor-pointer">
                  <div
                    onClick={() => OpenStore()}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[14px]">Kênh người bán</span>
                    <FaStore className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                  </div>
                  <div className="border-r border-gray-400 mx-10 h-6"></div>

                  <div className="group py-6 flex flex-col justify-center items-center mr-10">
                    <FaCartPlus className="w-[24px] h-[24px]  hover:fill-[#59595b] " />
                    {dataCarts?.store?.length! > 0 && isShowCart && (
                      <>
                        <div className="group-hover:block group-hover:shadow-inner hidden">
                          <FramePopup>
                            <div
                              className="text-center rounded-lg cursor-pointer hover:bg-[#c1d2f6] px-1  text-blue-500 font-bold py-2"
                              onClick={() => (window.location.href = "/cart")}
                            >
                              Xem tất cả
                            </div>
                            <>
                              {dataCarts?.store.map((store, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col items-start mb-2 border-b-2 border-[#90b0f4] max-w-full"
                                  >
                                    <div>
                                      <Link
                                        href={`/shop/user/${store.id}`}
                                        className="flex items-center hover:bg-[#c1d2f6] p-2 rounded-lg"
                                      >
                                        <span className="text-[14px] font-bold p-2">
                                          {store.name}
                                        </span>
                                      </Link>
                                    </div>
                                    {store.product.length > 0 &&
                                      store.product.map((product, index) => (
                                        <Link
                                          key={index}
                                          href={`/product/${product.id}`}
                                        >
                                          <div className="flex justify-between products-center w-[500px] cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg">
                                            <img
                                              className="rounded-full w-[54px] h-[54px] mr-2"
                                              src={product.avatar}
                                              alt="Loading..."
                                            />
                                            <span className="text-[12px]">
                                              x{product.quantity}
                                            </span>
                                            <p className="text-[12px] mr-2 text-ellipsis line-clamp-1 overflow-hidden max-w-[50%]">
                                              {product.name}
                                            </p>
                                            <span className="text-[12px]">
                                              {FormatMoney(product.price)}
                                            </span>
                                          </div>
                                        </Link>
                                      ))}
                                  </div>
                                );
                              })}
                            </>
                          </FramePopup>
                        </div>

                        <div
                          className={`flex justify-center items-center w-[20px] h-[20px] ${"bg-[#6499FF]"} rounded-full absolute mt-[-24px] ml-[30px]`}
                        >
                          <span className="text-[12px] text-white">
                            {totalCart}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="group py-6 flex flex-col justify-center items-center">
                    <FaBell className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                    {dataNoti.length > 0 && isShowCart && (
                      <>
                        <div className="group-hover:block group-hover:shadow-inner hidden">
                          <FramePopup>
                            {dataNoti.map((item, index) => (
                              <Notification
                                key={index}
                                data={item}
                                setCountNewNoti={() =>
                                  setCountNewNoti((prev) => prev - 1)
                                }
                              />
                            ))}
                          </FramePopup>
                        </div>
                        {countNewNoti > 0 && (
                          <div
                            className={`flex justify-center items-center w-[20px] h-[20px] ${"bg-[#6499FF]"} rounded-full absolute mt-[-24px] ml-[30px]`}
                          >
                            <span className="text-[12px] text-white">
                              {countNewNoti}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {user ? (
              <div className="flex items-center group py-10">
                <img
                  className="rounded-full w-[50px] h-[50px] cursor-pointer"
                  src={user.avatar || user.photoURL}
                  alt="Loading..."
                  onClick={profileToggleDropdown}
                />
                <span className="pl-3">{user.fullName}</span>
                <ul className="z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#D2E0FB] rounded-lg absolute w-[158px] top-16 hidden group-hover:block">
                  <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                    <Link href="/user/profile">Tài khoản của tôi</Link>
                  </li>
                  <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                    <Link href="/user/invoice">Đơn mua</Link>
                  </li>
                  <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                    <div
                      onClick={(e) => {
                        logOut();
                      }}
                    >
                      Đăng xuất
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center">
                <Link href="/login">
                  <span className="text-[14px] font-medium cursor-pointer">
                    Đăng Nhập
                  </span>
                </Link>
                <div className="border-r border-gray-400 mx-3 h-6"></div>
                <Link href="/sign-up">
                  <span className="text-[14px] font-medium cursor-pointer">
                    Đăng Ký
                  </span>
                </Link>
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
}

export default Header;
