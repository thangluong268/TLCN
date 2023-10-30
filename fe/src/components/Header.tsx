'use client'
import Link from "next/link";
import React from "react";
import { FaComments, FaBell, FaCartPlus, FaSistrix, FaStore } from "react-icons/fa";
import NotificationNormal from "./NotificationNormal";
import NotificationFriend from "./NotificationFriend";
import CartPreview from "./CartPreview";
import FramePopup from "./FramePopup";
import { APIGetAllNotification } from "@/services/Notification";
import axios from "axios";

function Header() {
  const isLogin = true
  // const dataNoti = [
  //   {
  //     userName: "Hải Đăng",
  //     content: "đã bày tỏ cảm xúc về sản phẩm của bạn.",
  //     type: "Cảm xúc",
  //     status: "UnRead"
  //   },
  // ]

  const dataCart = [
    {
      productName: "Đồng hồ điện tử thể thao điện tử ádasdasdasdasdasd",
      price: "99.000đ",
    },
    {
      productName: "Đồng hồ điện tử thể thao",
      price: "99.000đ",
    },
    {
      productName: "Đồng hồ điện tử thể thao",
      price: "99.000đ",
    },
    {
      productName: "Đồng hồ điện tử thể thao",
      price: "99.000đ",
    },
  ]

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isNotiOpen, setIsNotiOpen] = React.useState(false);
  const [countNewNoti, setCountNewNoti] = React.useState(0);
  const [countCart, setCountCart] = React.useState(0);
  const textViewAllCart = "<<Xem tất cả>>"

  const profileToggleDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const CartToggleDropdown = () => {
    setIsCartOpen(!isCartOpen)
    setIsProfileOpen(false)
    setIsNotiOpen(false)
  }

  const NotiToggleDropdown = async () => {
    // if (!isNotiOpen) {
    //   dataNoti.notifications.map((item) => {
    //     if (item.status === "UnRead") {
    //       item.status = "Read"
    //     }
    //   })
    // }

    console.log(dataNoti.notifications)
    setIsNotiOpen(!isNotiOpen);
    setIsProfileOpen(false)
    setIsCartOpen(false)
  };

  const [dataNoti, setDataNoti] = React.useState({
    total: 0, notifications: [{
      userId: '',
      content: '',
      type: '',
      status: false,
    }]
  })


  React.useEffect(() => {
    const fetchNoti = async () => {
      const data = await APIGetAllNotification({ page: 1, limit: 5 })
      setDataNoti(data)
    }
    fetchNoti()
  }, [])

  React.useEffect(() => {
    setCountCart(dataCart.length)
    setCountNewNoti(dataNoti.notifications.filter((item) => item.status === false).length)
  }, [dataCart])

  return (
    <header className="h-[60px]">
      <div className="flex justify-between items-center w-full h-[60px] bg-[#D2E0FB] px-[160px] fixed top-0 left-0 right-0 z-999">
        <Link href='/'><img className="cursor-pointer" src="/logo.png" alt="Loading..." /></Link>

        <div className="flex items-center rounded-3xl w-[400px] h-[40px] bg-[#E1E9F7] px-2">
          <div className="p-2">
            <FaSistrix className="w-[24px] h-[24px] hover:cursor-pointer" />
          </div>
          <input type="text" placeholder="Tìm kiếm sản phẩm..." className="flex-1 h-full outline-none bg-transparent" />
        </div>

        <div className="flex items-center">

          <div className="flex flex-col items-center mb-5">
            <span className="text-[14px]">Kênh người bán</span>
            <FaStore className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
          </div>

          <div className="border-r border-gray-400 mx-10 h-6"></div>

          <div className="flex flex-col justify-center items-center mr-10">
            <FaCartPlus
              className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]"
              onClick={CartToggleDropdown}
            />
            {isCartOpen && (
              <FramePopup>
                {dataCart.map((item) => (
                  <>
                    <CartPreview props={item} />
                  </>
                ))}
                <Link
                  className="text-center border-t-2 border-[#90b0f4] rounded-lg cursor-pointer hover:bg-[#c1d2f6] px-1 text-[12px] text-blue-500 font-bold py-2"
                  href="/cart/getAll">
                  {textViewAllCart}
                </Link>
              </FramePopup>
            )}
            {countCart > 0 && (
              <div className='flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]'>
                <span className="text-[12px] text-white">{countCart}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center mr-10">
            <FaComments className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]" />
            <div className='flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]'>
              <span className="text-[12px] text-white">1</span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <FaBell
              className="w-[24px] h-[24px] cursor-pointer hover:fill-[#59595b]"
              onClick={NotiToggleDropdown}
            />
            {isNotiOpen && (
              <FramePopup>
                {dataNoti.notifications.map((item) => (
                  item.status === false
                    ? item.type === "Kết bạn"
                      ? <NotificationFriend props={item} />
                      : <NotificationNormal props={item} />
                    : <></>
                ))}
              </FramePopup>

            )}
            {countNewNoti > 0 && (
              <div className='flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full absolute mt-[-24px] ml-[30px]'>
                <span className="text-[12px] text-white">{countNewNoti}</span>
              </div>
            )}
          </div>

        </div>

        {isLogin
          ? (
            <div className="flex items-center">
              <img
                className="rounded-full w-[50px] h-[50px] cursor-pointer"
                src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-1/333672359_223615343396138_7077399135899680905_n.jpg?stp=cp6_dst-jpg_p60x60&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=cTn9WrZsic0AX_AQIZb&_nc_ht=scontent.fsgn2-6.fna&oh=00_AfALiVYWauduHdwJD0z93BH0R1y4h53sgB68dxHEmYsAuw&oe=653D2D32"
                alt="Loading..."
                onClick={profileToggleDropdown}
              />
              <span className="pl-3">Thắng Lương</span>
              {isProfileOpen && (
                <ul
                  className="z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#D2E0FB] rounded-lg absolute w-[158px] top-16"
                >
                  <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                    <Link href="/user/:id">Tài khoản của tôi</Link>
                  </li>
                  <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                    <Link href="/bill/user?status='Đã đặt'">Đơn mua</Link>
                  </li>
                  <li className="text-[14px] h-[32px] flex justify-center items-center rounded-lg hover:bg-[#c1d2f6] cursor-pointer hover:text-white">
                    <Link href="/auth/logout">Đăng xuất</Link>
                  </li>
                </ul>
              )}
            </div>
          )
          : (
            <div className="flex items-center">
              <Link href="/auth/login">
                <span className="text-[14px] font-medium cursor-pointer">Đăng Nhập</span>
              </Link>
              <div className="border-r border-gray-400 mx-3 h-6"></div>
              <Link href="/auth/signup">
                <span className="text-[14px] font-medium cursor-pointer">Đăng Ký</span>
              </Link>
            </div>
          )
        }

      </div>
    </header>
  );
}

export default Header;
