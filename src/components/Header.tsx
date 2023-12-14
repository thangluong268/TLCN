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
import { NotiData } from "@/types/Notification";
import { APIGetAllCart } from "@/services/Cart";
import { Cart, Order } from "@/types/Cart";
import Toast from "@/utils/Toast";
import { APIGetMyStore } from "@/services/Store";
import { setCartPopUp } from "@/redux/features/cart/cartpopup-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import FormatMoney from "@/utils/FormatMoney";
import { UserAuth } from "@/app/authContext";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const { logOut } = UserAuth();

  const [user, setUser] = React.useState<UserInterface>();
  const [isShowCart, setIsShowCart] = React.useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const dataCarts = useAppSelector((state) => state.cartPopupReducer.items);
  const totalCart = useAppSelector((state) => state.cartPopupReducer.totalCart);
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    setUser(user);
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
        dispatch(setCartPopUp(carts));
      }
    };
    if (user && user.role != "admin") {
      fetchAllCart();
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
      window.location.href = "/store/seller/" + store.metadata.data._id;
    } else {
      window.location.href = "/store/create";
    }
  };
  const Search = () => {};
  return (
    <header className="h-[60px]">
      <div className="flex justify-between items-center w-full h-[60px] bg-[#D2E0FB] px-[10%] fixed top-0 left-0 right-0 z-10">
        <img
          className="cursor-pointer w-[8%]"
          src="/logo.png"
          alt="Loading..."
          onClick={() => (window.location.href = "/")}
        />

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

        {user && (
          <>
            <div className="flex items-center">
              <div
                onClick={() => OpenStore()}
                className="flex flex-col items-center"
              >
                <span className="text-[14px]">Kênh người bán</span>
                <FaStore className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
              </div>
              <div className="border-r border-gray-400 mx-10 h-6"></div>

              <div className="group py-6 flex flex-col justify-center items-center mr-10">
                <FaCartPlus className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b] " />
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
                                    href={`/store/user/${store.id}`}
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

              <div className="flex flex-col justify-center items-center mr-10">
                <FaComments className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]">
                  <span className="text-[12px] text-white">1</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <FaBell className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
                {/* {isNotiOpen && user && (
              <FramePopup total={dataNoti.total} component="notification">
                {dataNoti.notifications.length > 0 ? (
                  <>
                    {dataNoti.notifications.map((item) => (
                      <Notification props={item} />
                    ))}
                  </>
                ) : (
                  <div className="flex justify-center items-center w-[300px] hover:bg-[#c1d2f6] p-2 rounded-lg">
                    <span className="text-[14px] cursor-default">
                      Không có thông báo mới
                    </span>
                  </div>
                )}
              </FramePopup>
            )} */}
                {countNewNoti > 0 && (
                  <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]">
                    <span className="text-[12px] text-white">
                      {countNewNoti}
                    </span>
                  </div>
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
                    localStorage.removeItem("user");
                    window.location.href = "/login";
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
            <Link href="/signup">
              <span className="text-[14px] font-medium cursor-pointer">
                Đăng Ký
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
