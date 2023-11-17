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
import { APIGetAllCartPaging } from "@/services/Cart";
import { CartData } from "@/types/Cart";
import Toast from "@/utils/Toast";
import FrameCartPreview from "./FrameCartPreview";
import CartPreview from "./CartPreview";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isNotiOpen, setIsNotiOpen] = React.useState(false);
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const [user, setUser] = React.useState<UserInterface>();
  const [dataNoti, setDataNoti] = React.useState<NotiData>({
    total: 0,
    notifications: [],
  });
  const [dataCart, setDataCart] = React.useState<CartData>({
    total: 0,
    carts: [],
  });

  const textViewAllCart = "<<Xem tất cả>>";

  const profileToggleDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const CartToggleDropdown = () => {
    setIsCartOpen(!isCartOpen);
    setIsProfileOpen(false);
    setIsNotiOpen(false);
  };

  const NotiToggleDropdown = () => {
    if (!isNotiOpen && user) {
      dataNoti.notifications.map(async (item: any) => {
        if (!item.status) {
          await APIUpdateNotification(item._id, {
            content: item.content,
            status: true,
            sub: item.sub,
          });
        }
      });
    }
    setCountNewNoti(0);
    setIsNotiOpen(!isNotiOpen);
    setIsProfileOpen(false);
    setIsCartOpen(false);
  };
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    if (user) {
      const fetchNoti = async () => {
        const res = await APIGetAllNotification({ page: 1, limit: 5 });
        if (res.status !== 200 && res.status !== 201) {
          Toast("error", res.message, 5000);
          return;
        }
        setCountNewNoti(
          res.metadata.data.notifications.filter(
            (item: any) => item.status === false
          ).length
        );
        setDataNoti(res.metadata.data);
      };
      const fetchCart = async () => {
        const res = await APIGetAllCartPaging({ page: 1, limit: 5, search: "" });
        if (res.status !== 200 && res.status !== 201) {
          Toast("error", res.message, 5000);
          return;
        }
        setDataCart(res.metadata.data);
      };
      fetchCart();
      fetchNoti();
    }
    setUser(user);
  }, []);

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
            className="flex-1 h-full outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center">
          <Link href={"/store/create"} className="flex flex-col items-center">
            <span className="text-[14px]">Kênh người bán</span>
            <FaStore className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
          </Link>

          <div className="border-r border-gray-400 mx-10 h-6"></div>

          <div className="flex flex-col justify-center items-center mr-10">
            <FaCartPlus
              className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]"
              onClick={CartToggleDropdown}
            />
            {isCartOpen && (
              <FramePopup total={dataCart.total} component="cart">
                <>
                  <Link
                    className="text-center rounded-lg cursor-pointer hover:bg-[#c1d2f6] px-1 text-[12px] text-blue-500 font-bold py-2"
                    href="/cart"
                  >
                    {textViewAllCart}
                  </Link>
                  {dataCart.carts.length > 0 ? (
                    <>
                      {dataCart.carts.map((data) => (
                        <FrameCartPreview props={data}>
                          {data.listProducts.map((item) => (
                            <>
                              <CartPreview props={item} />
                            </>
                          ))}
                        </FrameCartPreview>
                      ))}
                    </>
                  ) : (
                    <div className="flex justify-center items-center w-[300px] hover:bg-[#c1d2f6] p-2 rounded-lg">
                      <span className="text-[14px] cursor-default">
                        Không có sản phẩm nào
                      </span>
                    </div>
                  )}
                </>
              </FramePopup>
            )}
            {dataCart.total > 0 && (
              <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]">
                <span className="text-[12px] text-white">{dataCart.total}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center mr-10">
            <FaComments className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
            <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]">
              <span className="text-[12px] text-white">1</span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <FaBell
              className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]"
              onClick={NotiToggleDropdown}
            />
            {isNotiOpen && user && (
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
            )}
            {countNewNoti > 0 && (
              <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]">
                <span className="text-[12px] text-white">{countNewNoti}</span>
              </div>
            )}
          </div>
        </div>

        {user ? (
          <div className="flex items-center">
            <img
              className="rounded-full w-[50px] h-[50px] cursor-pointer"
              src={user.avatar}
              alt="Loading..."
              onClick={profileToggleDropdown}
            />
            <span className="pl-3">{user.fullName}</span>
            {isProfileOpen && (
              <ul className="z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#D2E0FB] rounded-lg absolute w-[158px] top-16">
                <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                  <Link href="/user/:id">Tài khoản của tôi</Link>
                </li>
                <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                  <Link href="/bill/user?status='Đã đặt'">Đơn mua</Link>
                </li>
                <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                  <Link href="/logout">Đăng xuất</Link>
                </li>
              </ul>
            )}
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
