"use client";
import Input from "@/components/Input";
import React from "react";
import { FaTruckFast, FaTruckField } from "react-icons/fa6";
function Payment() {
  const [isGift, setIsGift] = React.useState(false);
  const [isDetail, setIsDetail] = React.useState(false);
  return (
    <div className="min-h-screen flex px-[160px] my-4">
      <div className="w-[70%] mr-4 rounded-sm">
        <div className="bg-white rounded-md p-4 mb-5">
          {/* List store */}
          <div className="text-lg font-bold">Cửa hàng 1</div>
          <div className="">
            {/* List product */}
            <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
              <div className="flex items-center">
                <div className="w-[100px] h-[100px]">
                  <img
                    className=" w-full h-full"
                    src="/test.jpg"
                    alt="Loading..."
                  />
                </div>
                <div className="ml-4">
                  <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                    Hộp bảo quản thủy tinh LocknLock BLANC - Hộp chữ nhậ Hộp bảo
                    quản thủy tinh LocknLock BLANC - Hộp chữ nhậ
                  </div>
                  <div className="text-sm font-bold">100.000đ</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm">x1</div>
              </div>
            </div>
            <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
              <div className="flex items-center">
                <div className="w-[100px] h-[100px]">
                  <img
                    className=" w-full h-full"
                    src="/test.jpg"
                    alt="Loading..."
                  />
                </div>
                <div className="ml-4">
                  <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                    Hộp bảo quản thủy tinh LocknLock BLANC - Hộp chữ nhậ Hộp bảo
                    quản thủy tinh LocknLock BLANC - Hộp chữ nhậ
                  </div>
                  <div className="text-sm font-bold">100.000đ</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm">x1</div>
              </div>
            </div>
          </div>
          <Input label="Lưu ý cho người bán">
            <textarea
              name=""
              id=""
              cols={30}
              rows={1}
              className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
            ></textarea>
          </Input>
          <div className="mt-2 font-bold text-right">
            Tổng tiền: 53.000 đồng
          </div>
        </div>
        <div className="bg-white rounded-md p-4 mb-5">
          {/* List store */}
          <div className="text-lg font-bold">Cửa hàng 1</div>
          <div className="">
            {/* List product */}
            <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
              <div className="flex items-center">
                <div className="w-[100px] h-[100px]">
                  <img
                    className=" w-full h-full"
                    src="/test.jpg"
                    alt="Loading..."
                  />
                </div>
                <div className="ml-4">
                  <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                    Hộp bảo quản thủy tinh LocknLock BLANC - Hộp chữ nhậ Hộp bảo
                    quản thủy tinh LocknLock BLANC - Hộp chữ nhậ
                  </div>
                  <div className="text-sm font-bold">100.000đ</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm">x1</div>
              </div>
            </div>
            <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
              <div className="flex items-center">
                <div className="w-[100px] h-[100px]">
                  <img
                    className=" w-full h-full"
                    src="/test.jpg"
                    alt="Loading..."
                  />
                </div>
                <div className="ml-4">
                  <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                    Hộp bảo quản thủy tinh LocknLock BLANC - Hộp chữ nhậ Hộp bảo
                    quản thủy tinh LocknLock BLANC - Hộp chữ nhậ
                  </div>
                  <div className="text-sm font-bold">100.000đ</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm">x1</div>
              </div>
            </div>
          </div>
          <Input label="Lưu ý cho người bán">
            <textarea
              name=""
              id=""
              cols={30}
              rows={1}
              className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
            ></textarea>
          </Input>
          <div className="mt-2 font-bold text-right">
            Tổng tiền: 53.000 đồng
          </div>
        </div>
        <div className="bg-white rounded-md p-4 mb-5">
          {/* List store */}
          <div className="text-lg font-bold">Cửa hàng 1</div>
          <div className="">
            {/* List product */}
            <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
              <div className="flex items-center">
                <div className="w-[100px] h-[100px]">
                  <img
                    className=" w-full h-full"
                    src="/test.jpg"
                    alt="Loading..."
                  />
                </div>
                <div className="ml-4">
                  <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                    Hộp bảo quản thủy tinh LocknLock BLANC - Hộp chữ nhậ Hộp bảo
                    quản thủy tinh LocknLock BLANC - Hộp chữ nhậ
                  </div>
                  <div className="text-sm font-bold">100.000đ</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm">x1</div>
              </div>
            </div>
            <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
              <div className="flex items-center">
                <div className="w-[100px] h-[100px]">
                  <img
                    className=" w-full h-full"
                    src="/test.jpg"
                    alt="Loading..."
                  />
                </div>
                <div className="ml-4">
                  <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                    Hộp bảo quản thủy tinh LocknLock BLANC - Hộp chữ nhậ Hộp bảo
                    quản thủy tinh LocknLock BLANC - Hộp chữ nhậ
                  </div>
                  <div className="text-sm font-bold">100.000đ</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm">x1</div>
              </div>
            </div>
          </div>
          <Input label="Lưu ý cho người bán">
            <textarea
              name=""
              id=""
              cols={30}
              rows={1}
              className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
            ></textarea>
          </Input>
          <div className="mt-2 font-bold text-right">
            Tổng tiền: 53.000 đồng
          </div>
        </div>
      </div>
      <div className="w-[30%] rounded-sm flex flex-col">
        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">
            Chọn phương thức giao hàng
          </div>
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
            />
            <FaTruckFast className="w-8 h-8 mr-2" />
            <div>Giao hàng nhanh</div>
          </div>
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
            />
            <FaTruckField className="w-8 h-8 mr-2" />

            <div>Giao hàng tiết kiệm</div>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">
            Chọn phương thức thanh toán
          </div>
          <div className={`flex items-center mb-3 ${isGift ? "hidden" : ""}`}>
            <input
              type="radio"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
            />
            <img
              src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
              alt=""
              className="w-8 h-8 mr-2 "
            />
            <div>Thanh toán tiền mặt khi nhận hàng</div>
          </div>
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
            />
            <img
              src="https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg"
              alt=""
              className="w-8 h-8 mr-2 "
            />
            <div>Thanh toán bằng ví MoMo</div>
          </div>
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
            />
            <img
              src="https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png"
              alt=""
              className="w-8 h-8 mr-2 "
            />
            <div>Thanh toán bằng VNPAY</div>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex justify-between">
            <div className="text-lg font-bold mb-3">Giao đến</div>
            <div className="text-blue-400 cursor-pointer">Thay đổi</div>
          </div>
          <div className="font-medium">Hải Đăng | 0868366694</div>
          <div className="text-gray-500">
            Trường Đại học Tài chính - Marketing, Số 2/4 Trần Xuân Soạn, Phường
            Tân Thuận Tây, Quận 7, Hồ Chí Minh
          </div>
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
              onChange={(e) => {
                setIsGift(e.target.checked);
              }}
            />
            <div className="text-lg font-bold">
              Gửi tặng đến người thân, bạn bè
            </div>
          </div>
          <div className={isGift ? "" : "hidden"}>
            <Input label="Tên người gửi">
              <input
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </Input>
            <Input label="Tên người nhận">
              <input
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </Input>
            <Input label="Lời chúc">
              <input
                type="text"
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </Input>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">Đơn hàng</div>
          <div className="flex">
            <div className="mr-2">1 sản phẩm</div>
            <div
              className="text-blue-400 cursor-pointer"
              onClick={(e) => setIsDetail(!isDetail)}
            >
              Xem chi tiết
            </div>
          </div>
          <div className={isDetail ? "" : "hidden"}>
            <hr className="w-full my-4" />
            <div className="flex mt-2 items-center text-center">
              <div className="w-[10%] text-left">x1</div>
              <div className="w-[60%] text-ellipsis line-clamp-2">
                Hạhd dhaisidhasd iad ád ád ád ád ád ád ád ád á Hạhd dhaisidhasd
                iad ád ád ád ád ád ád ád ád á
              </div>
              <div className="w-[30%] text-right">55.000 đ</div>
            </div>
            <div className="flex mt-2 items-center text-center">
              <div className="w-[10%] text-left">x1</div>
              <div className="w-[60%] text-ellipsis line-clamp-2">
                Hạhd dhaisidhasd iad ád ád ád ád ád ád ád ád á Hạhd dhaisidhasd
                iad ád ád ád ád ád ád ád ád á
              </div>
              <div className="w-[30%] text-right">55.000 đ</div>
            </div>
            <div className="flex mt-2 items-center text-center">
              <div className="w-[10%] text-left">x1</div>
              <div className="w-[60%] text-ellipsis line-clamp-2">
                Hạhd dhaisidhasd iad ád ád ád ád ád ád ád ád á Hạhd dhaisidhasd
                iad ád ád ád ád ád ád ád ád á
              </div>
              <div className="w-[30%] text-right">55.000 đ</div>
            </div>
          </div>
          <div>
            <hr className="w-full my-4" />
            <div className="flex">
              <div className="w-[70%]">Tạm tính</div>
              <div className="w-[30%] text-right">55.000 đ</div>
            </div>
            <div className="flex">
              <div className="w-[70%]">Phí vận chuyển</div>
              <div className="w-[30%] text-right">55.000 đ</div>
            </div>
          </div>
          <div>
            <hr className="w-full my-4" />
            <div className="flex">
              <div className="w-[70%]">Tổng cộng</div>
              <div className="w-[30%] text-right text-red-500 font-bold text-lg">
                55.000 đ
              </div>
            </div>
          </div>
          <div>
            <hr className="w-full my-4" />
            {/* Button Đặt hàng */}
            <div className="flex justify-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
