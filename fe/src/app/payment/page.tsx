"use client";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useAppSelector } from "@/redux/store";
import { APIUpdateUser } from "@/services/User";
import CheckValidInput from "@/utils/CheckValidInput";
import FormatMoney from "@/utils/FormatMoney";
import Toast from "@/utils/Toast";
import React from "react";
import { FaTruckFast, FaTruckField } from "react-icons/fa6";
function Payment() {
  const [isShow, setIsShow] = React.useState(false);
  const [isUpdate_Add, setIsUpdate_Add] = React.useState({
    state: false,
    add: false,
    edit: false,
  });
  const [isGift, setIsGift] = React.useState(false);
  const [indexAddressPicked, setIndexAddressPicked] = React.useState(0);
  const [isDetail, setIsDetail] = React.useState(false);
  const [data, setData] = React.useState([] as any[]);
  const [user, setUser] = React.useState({} as any);
  const [addressPopup, setAddressPopup] = React.useState({
    receiverName: "",
    receiverPhone: "",
    address: "",
  });
  const [deliveryMethod, setDeliveryMethod] = React.useState([
    {
      name: "Giao hàng nhanh",
      icon: <FaTruckFast className="w-8 h-8 mr-2" />,
      checked: true,
      price: 30000,
    },
    {
      name: "Giao hàng tiết kiệm",
      icon: <FaTruckField className="w-8 h-8 mr-2" />,
      checked: false,
      price: 15000,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = React.useState([
    {
      name: "Thanh toán tiền mặt khi nhận hàng",
      icon: (
        <img
          src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
          alt=""
          className="w-8 h-8 mr-2 "
        />
      ),
      checked: true,
    },
    {
      name: "Thanh toán bằng ví MoMo",
      icon: (
        <img
          src="https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg"
          alt=""
          className="w-8 h-8 mr-2 "
        />
      ),
      checked: false,
    },
    {
      name: "Thanh toán bằng VNPAY",
      icon: (
        <img
          src="https://salt.tikicdn.com/ts/upload/77/6a/df/a35cb9c62b9215dbc6d334a77cda4327.png"
          alt=""
          className="w-8 h-8 mr-2 "
        />
      ),
      checked: false,
    },
  ]);
  const [receiverInfo, setReceiverInfo] = React.useState({
    receiverName: "",
    receiverPhone: "",
    address: "",
  });

  const store = useAppSelector((state) => state.cartPopupReducer.items);
  React.useEffect(() => {
    let listProducts = [] as any[];
    const listProductIdChecked = JSON.parse(
      localStorage.getItem("listProductIdChecked") || "[]"
    );
    listProductIdChecked.forEach((item: any) => {
      store?.store?.forEach((store: any) => {
        var obj = {
          storeId: store.id,
          storeName: store.name,
          products: [] as any[],
          totalPrice: 0,
        };
        store.product?.forEach((product: any) => {
          if (product.id === item.id) {
            obj.products.push({
              ...product,
              quantity: item.quantity,
              notes: "",
            });
            obj.totalPrice += product.price * item.quantity;
          }
        });
        obj.products.length > 0 && listProducts.push(obj);
      });
    });
    setData(listProducts);
  }, [store]);
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")!).providerData[0];
    if (user) {
      const address = user.address?.filter((item: any) => item.default);
      if (address.length > 0) {
        setReceiverInfo({
          receiverName: address[0].receiverName || "Không xác định",
          receiverPhone: address[0].receiverPhone || "Không xác định",
          address: address[0].address || "Không xác định",
        });
      }
      setUser(user);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const ConfirmChangeAddress = () => {
    const user = JSON.parse(localStorage.getItem("user")!).providerData[0];
    setReceiverInfo({
      receiverName: user.address[indexAddressPicked].receiverName || "",
      receiverPhone: user.address[indexAddressPicked].receiverPhone || "",
      address: user.address[indexAddressPicked].address || "",
    });
    setIsShow(false);
  };

  const ChangeAddress = async () => {
    if (
      addressPopup.receiverName === "" ||
      addressPopup.receiverPhone === "" ||
      addressPopup.address === ""
    ) {
      Toast("error", "Vui lòng nhập đầy đủ thông tin", 2000);
      return;
    }

    if (CheckValidInput({ phone: addressPopup.receiverPhone }) !== "") {
      Toast("error", "Số điện thoại không hợp lệ", 2000);
      return;
    }
    const userLocal = JSON.parse(localStorage.getItem("user")!);
    if (isUpdate_Add.add) {
      // Tìm địa chỉ mặc định và set default = false
      userLocal.providerData[0].address.forEach((item: any) => {
        if (item.default) {
          item.default = false;
        }
      });
      let newArr = [
        {
          receiverName: addressPopup.receiverName,
          receiverPhone: addressPopup.receiverPhone,
          address: addressPopup.address,
          default: true,
        },
        ...userLocal.providerData[0].address,
      ];
      userLocal.providerData[0].address = newArr;
      setIndexAddressPicked(0);
      Toast("success", "Thêm địa chỉ thành công", 2000);
    } else {
      // Edit address to user in localStorage and set default and setUser
      const defaultValue =
        userLocal.providerData[0]?.address[indexAddressPicked].default;
      userLocal.providerData[0].address[indexAddressPicked] = {
        receiverName: addressPopup.receiverName,
        receiverPhone: addressPopup.receiverPhone,
        address: addressPopup.address,
        default: defaultValue,
      };
      Toast("success", "Sửa địa chỉ thành công", 2000);
    }
    localStorage.setItem("user", JSON.stringify(userLocal));
    setUser(userLocal.providerData[0]);
    setIsUpdate_Add({ state: false, add: false, edit: false });

    const user = await APIUpdateUser(
      userLocal.providerData[0]._id,
      userLocal.providerData[0].address
    );
  };
  return (
    <div className="min-h-screen flex px-[160px] my-4">
      <div className="w-[70%] mr-4 rounded-sm">
        {data?.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-4 mb-5">
            {/* List store */}
            <div className="text-lg font-bold">{item.storeName}</div>
            <div className="">
              {/* List product */}
              {item.products?.map((product: any, index: number) => (
                <div className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm ">
                  <div className="flex items-center">
                    <div className="w-[100px] h-[100px]">
                      <img
                        className=" w-full h-full"
                        src={product.avatar}
                        alt="Loading..."
                      />
                    </div>
                    <div className="ml-4">
                      <div className="max-w-[80%] text-ellipsis line-clamp-1 text-">
                        {product.name}
                      </div>
                      <div className="text-sm font-bold">
                        {FormatMoney(product.price)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-right min-w-[5%]">
                    x {product.quantity}
                  </div>
                </div>
              ))}
            </div>
            <Input label="Lưu ý cho người bán">
              <textarea
                cols={30}
                rows={1}
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                value={item.notes}
                onChange={(e) => {
                  let newData = [...data];
                  newData[index].notes = e.target.value;
                  setData(newData);
                }}
              ></textarea>
            </Input>
            <div className="mt-2 font-bold text-right">
              Tổng tiền: {FormatMoney(item.totalPrice)}
            </div>
          </div>
        ))}
      </div>
      <div className="w-[30%] rounded-sm flex flex-col">
        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">
            Chọn phương thức giao hàng
          </div>
          {deliveryMethod.map((item, index) => (
            <div className="flex items-center mb-3">
              <input
                type="radio"
                checked={item.checked}
                className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
                onChange={(e) => {
                  let newData = [...deliveryMethod];
                  newData.forEach((item) => {
                    item.checked = false;
                  });
                  newData[index].checked = true;
                  setDeliveryMethod(newData);
                }}
              />
              {item.icon}
              <div>{item.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">
            Chọn phương thức thanh toán
          </div>
          {paymentMethod.map((item, index) => (
            <div
              className={`flex items-center mb-3 ${
                isGift && index == 0 ? "hidden" : ""
              }`}
            >
              <input
                type="radio"
                checked={item.checked}
                className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
                onChange={(e) => {
                  let newData = [...paymentMethod];
                  newData.forEach((item) => {
                    item.checked = false;
                  });
                  newData[index].checked = true;
                  setPaymentMethod(newData);
                }}
              />
              {item.icon}
              <div>{item.name}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex justify-between">
            <div className="text-lg font-bold mb-3">Giao đến</div>
            <div
              className="text-blue-400 cursor-pointer"
              onClick={(e) => {
                setIsShow(true),
                  setIsUpdate_Add({ state: false, add: false, edit: false });
              }}
            >
              Thay đổi
            </div>
          </div>
          <div className="font-medium">
            {receiverInfo.receiverName} | {receiverInfo.receiverPhone}
          </div>
          <div className="text-gray-500">{receiverInfo.address}</div>
        </div>
        <Modal
          isShow={isShow}
          setIsShow={(data: any) => setIsShow(data)}
          confirm={() => ConfirmChangeAddress()}
          title="Thay đổi địa chỉ giao hàng"
        >
          {isUpdate_Add.state && (
            <div className="flex flex-col w-full">
              <Input label="Họ và tên">
                <input
                  type="text"
                  className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                  value={addressPopup.receiverName}
                  onChange={(e) => {
                    setAddressPopup({
                      ...addressPopup,
                      receiverName: e.target.value,
                    });
                  }}
                />
              </Input>
              <Input label="Số điện thoại">
                <input
                  type="text"
                  className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                  value={addressPopup.receiverPhone}
                  onChange={(e) => {
                    setAddressPopup({
                      ...addressPopup,
                      receiverPhone: e.target.value,
                    });
                  }}
                />
              </Input>
              <Input label="Địa chỉ">
                <input
                  type="text"
                  className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                  value={addressPopup.address}
                  onChange={(e) => {
                    setAddressPopup({
                      ...addressPopup,
                      address: e.target.value,
                    });
                  }}
                />
              </Input>
              <div className="flex justify-between my-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mr-2"
                  onClick={() => ChangeAddress()}
                >
                  Lưu
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md w-full ml-2"
                  onClick={() =>
                    setIsUpdate_Add({ state: false, add: false, edit: false })
                  }
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
          {user.address?.length > 0 && (
            <>
              <div className="grid grid-cols-5 gap-3 my-3">
                {user.address.map((item: any, index: number) => (
                  <div
                    className={`hover:shadow-lg cursor-pointer rounded-md  ease-linear transition-all duration-150 p-3 ${
                      indexAddressPicked == index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                    onClick={() => {
                      setAddressPopup({
                        receiverName: item.receiverName,
                        receiverPhone: item.receiverPhone,
                        address: item.address,
                      });
                      setIsUpdate_Add({ state: true, add: false, edit: true });
                      setIndexAddressPicked(index);
                    }}
                  >
                    <div className="font-bold">{item.receiverName}</div>
                    <div>{item.address}</div>
                    <div>{item.receiverPhone}</div>
                    {item.default && (
                      <div
                        className={`${
                          indexAddressPicked == index
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        (Mặc định)
                      </div>
                    )}
                  </div>
                ))}
                <div
                  className={`cursor-pointer rounded-md p-3 bg-gray-100 outline-dashed opacity-50 hover:opacity-100 ease-linear transition-all duration-150`}
                  onClick={() => {
                    setIsUpdate_Add({ state: true, add: true, edit: false });
                    setAddressPopup({
                      receiverName: "",
                      receiverPhone: "",
                      address: "",
                    });
                  }}
                >
                  <div className="flex items-center justify-center text-[65px] font-thin">
                    +
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name=""
              id=""
              className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"
              onChange={(e) => {
                setIsGift(e.target.checked);
                let newData = [...paymentMethod];
                newData[0].checked = false;
                newData[1].checked = true;
                setPaymentMethod(newData);
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
