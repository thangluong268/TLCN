"use client";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import ModalRequired from "@/components/ModalRequired";
import Paypal from "@/components/Paypal";
import { useAppSelector } from "@/redux/store";
import { APICreateBill } from "@/services/Bill";
import { APIRemoveProductInCart } from "@/services/Cart";
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
  const [showModalRequied, setShowModalRequied] = React.useState(false);
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
      value: "Express",
      icon: <FaTruckFast className="w-8 h-8 mr-2" />,
      checked: true,
      price: 30000,
    },
    {
      name: "Giao hàng tiết kiệm",
      value: "Economical",
      icon: <FaTruckField className="w-8 h-8 mr-2" />,
      checked: false,
      price: 15000,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = React.useState([
    {
      name: "Thanh toán tiền mặt khi nhận hàng",
      value: "CashOnDelivery",
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
      name: "Thanh toán bằng paypal",
      value: "Paypal",
      icon: (
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADpklEQVR4Ae2XA7D0VhSAv3uD9TNq27Zt27Ztux1PbQ1qd9RhbVvP9nqTe4pUedrU+r+ZZXC+HARKRPg7mSOgiYQhOgakDHi/PQMiwi677MLXX38NCLRstC8Nq56CqVQRVjn8fCeFntcY+/Apsp99AhqUBuD+++9nmWWW4ZfYwLQCb7/9NoEAsOC6x5PsWgVToSpKgUrtiax8KYOl6xh85gIIyGazANUFAOLxOAA46SSZpnmwNYhNdJwEC251PjE9TtdT1wForX9DDzj13wZPzoUYfh0CfgEa1jgTu7b+tzdhrGkRtOOAMDXVevYXAnayCbducWbAphrx5qVAEUZBOQd+hRkIBCwH7CSU8jkAUL8hA27j0iDh4OKjCsOo4uhMr2D5RB+qPAS7nbQfbkJjKtEzAAJBCZbEmFB8fA9EQFXx9zzIxIWdjzmLVKyM710YOQNBUDuOW7swGEIGxqN6UwYCssTigleENXY4nvmWaowugAGdmRs7NXdYAJRfoSq+DzUZYZUVFZUy2G49qdoFowuIAbdpYbQbQ4QQpgIoZs1exUM231hoblL4PiAgmF+XgXjrkqCmihkP1AyBSyWQb9l2C8Naq2vKZUBBpTxOMdtN9CbUEGuePAFB8EIh+PylhdaQTAiLLyay/lqw6CJBcBGwXej69F36cv3MWx9BQAQsF2KNS4UmAAGNsOaqQioJRkArI4mEor5W0doCTY0aRZAJCHAT8Pqz97LxDkTMgAEr5eLULRJqwLIHyyzsy26b2/gGEAANBNKeD55HqGfiSej5/G2eu/Nezt0zooAYcNKteMl5QMKZaWkQPA9KZWZFW5BIw3DPF9xw9F7kxwpYDtEz4DYuTCmWCB2NVlCXCUQmn3ZjSVAqeInwbcBBXnr0QR666hK6P+8FAImcgWACsgoQgODDsQ11aYUx4eBeaYTXn76NYm6cwY5xRvs/5bPX3qT3y37CRBRQCuItS0+SCro8nVSYSTV+4Zn7uPHYM/64e0LlQqx5WcQAKngZgUwK4jEVKoGyoO399wD+QAFLYSVaQIOygpdoqE2DY+uQgPGg54tP+Y3YzHQiaLt/d9q+nAulBIK/WPm4g7Dcw6Dyc/2LuQJ9bV//wQIg2bbPyX/7+iXNTUdhACHAsmB0aIChzp4/XADtEEZBTfMCGB8UAbYDnR+/QDFb/sOfjD7++GOKxWJ4Mprmn59kTSNifj7ZDHV9xsRwjggsscQSJJPJOc+G/yyBbwD59pkN5OE4OwAAAABJRU5ErkJggg=="
          alt=""
          className="w-8 h-8 mr-2 "
        />
      ),
      checked: false,
    },
    {
      name: "Thanh toán bằng ví MoMo",
      value: "MoMo",
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
      value: "VNPAY",
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
  const [giveInfo, setGiveInfo] = React.useState({
    senderName: "",
    wish: "",
  });
  const [showPaypal, setShowPaypal] = React.useState("hidden");

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
      if (!user.address?.length) {
        setShowModalRequied(true);
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
        userLocal.providerData[0]?.address[indexAddressPicked]?.default;
      userLocal.providerData[0].address[indexAddressPicked] = {
        receiverName: addressPopup.receiverName,
        receiverPhone: addressPopup.receiverPhone,
        address: addressPopup.address,
        default: defaultValue || true,
      };
      if (showModalRequied) {
        setReceiverInfo({
          receiverName: addressPopup.receiverName,
          receiverPhone: addressPopup.receiverPhone,
          address: addressPopup.address,
        });
      }
      setShowModalRequied(false);

      Toast("success", "Sửa địa chỉ thành công", 2000);
    }
    localStorage.setItem("user", JSON.stringify(userLocal));
    setUser(userLocal.providerData[0]);
    setIsUpdate_Add({ state: false, add: false, edit: false });

    const user = await APIUpdateUser(userLocal.providerData[0]._id, {
      address: userLocal.providerData[0].address,
    });
  };

  const HandleOrder = async () => {
    if (isGift) {
      if (
        giveInfo.senderName === "" ||
        giveInfo.wish === "" ||
        receiverInfo.receiverName === ""
      ) {
        Toast("error", "Vui lòng nhập đầy đủ thông tin", 2000);
        return;
      }
    }
    if (paymentMethod[0].checked) {
      CraeteBill();
    } else if (paymentMethod[1].checked) {
      setShowPaypal("");
    } else if (paymentMethod[2].checked) {
      Toast("", "Chức năng đang phát triển", 2000);
    } else {
      Toast("", "Chức năng đang phát triển", 2000);
    }
  };

  const CraeteBill = async () => {
    // {
    //   "data": [
    //     {
    //       "storeId": "string",
    //       "listProducts": [
    //         {
    //           "productId": "string",
    //           "quantity": 0,
    //           "type": "string"
    //         }
    //       ],
    //       "notes": "string",
    //       "totalPrice": 0
    //     }
    //   ],
    //   "deliveryMethod": "string",
    //   "paymentMethod": "string",
    //   "receiverInfo": {
    //     "fullName": "string",
    //     "phoneNumber": "string",
    //     "address": "string"
    //   },
    //   "giveInfo": {
    //     "senderName": "string",
    //     "wish": "string"
    //   },
    //   "deliveryFee": 0
    // }
    const listProducts = [] as any[];
    console.log(data);
    data?.forEach((item) => {
      const obj = {
        storeId: item.storeId,
        listProducts: [] as any[],
        notes: item.notes,
        totalPrice: item.totalPrice,
      };
      item.products.forEach((product: any) => {
        obj.listProducts.push({
          productId: product.id,
          quantity: product.quantity,
          type: product.price === 0 ? "GIVE" : "SELL",
        });
      });
      // Tìm xem nếu cửa hàng đã tồn tại thì push vào listProducts
      const index = listProducts.findIndex(
        (item) => item.storeId === obj.storeId
      );
      if (index !== -1) {
        listProducts[index].listProducts.push(...obj.listProducts);
        listProducts[index].totalPrice += obj.totalPrice;
      } else {
        listProducts.push(obj);
      }
    });
    const addressForPaypal = JSON.parse(
      localStorage.getItem("addressForPaypal")!
    );
    const obj = {
      data: listProducts,
      deliveryMethod: deliveryMethod.find((item) => item.checked)?.value,
      paymentMethod: paymentMethod.find((item) => item.checked)?.value,
      receiverInfo:
        paymentMethod.find((item) => item.checked)?.value == "Paypal"
          ? addressForPaypal
          : {
              fullName: receiverInfo.receiverName,
              phoneNumber: receiverInfo.receiverPhone,
              address: receiverInfo.address,
            },
      giveInfo: isGift && {
        senderName: giveInfo.senderName,
        wish: giveInfo.wish,
      },
      deliveryFee:
        deliveryMethod.find((item) => item.checked)?.price! * data?.length,
    };
    APICreateBill(obj);
    Toast("success", "Đặt hàng thành công", 2000);
    setTimeout(() => {
      localStorage.removeItem("listProductIdChecked");
      localStorage.removeItem("addressForPaypal");
      window.location.href = "/";
    }, 2000);
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
                <div
                  key={index}
                  className="flex justify-between mt-2 pr-2 items-center outline-1 outline-double outline-gray-300 rounded-sm "
                >
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
            <div key={index} className="flex items-center mb-3">
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
              key={index}
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
                  if (index != 1 && showPaypal == "") {
                    setShowPaypal("hidden");
                  }
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
                    key={index}
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
                      localStorage.setItem(
                        "addressForPaypal",
                        JSON.stringify({
                          fullName: item.receiverName,
                          phoneNumber: item.receiverPhone,
                          address: item.address,
                        })
                      );
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

        <ModalRequired
          isShow={showModalRequied}
          confirm={() => ChangeAddress()}
          title="Thêm địa chỉ giao hàng"
        >
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
          </div>
        </ModalRequired>

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
                if (e.target.checked) {
                  newData.forEach((item) => {
                    item.checked = false;
                  });
                  newData[1].checked = true;
                }
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
                value={giveInfo.senderName}
                onChange={(e) => {
                  setGiveInfo({ ...giveInfo, senderName: e.target.value });
                }}
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </Input>
            <Input label="Tên người nhận">
              <input
                type="text"
                value={receiverInfo.receiverName}
                disabled
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </Input>
            <Input label="Lời chúc">
              <input
                type="text"
                value={giveInfo.wish}
                onChange={(e) => {
                  setGiveInfo({ ...giveInfo, wish: e.target.value });
                }}
                className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              />
            </Input>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 mb-4">
          <div className="text-lg font-bold mb-3">Đơn hàng</div>
          <div className="flex">
            <div className="mr-2">{data.length} sản phẩm</div>
            <div
              className="text-blue-400 cursor-pointer"
              onClick={(e) => setIsDetail(!isDetail)}
            >
              Xem chi tiết
            </div>
          </div>
          <div className={isDetail ? "" : "hidden"}>
            <hr className="w-full my-4" />
            {/* List product */}
            {data?.map((item, index) =>
              item.products?.map((product: any, index: number) => (
                <div key={index} className="flex mt-2 items-center text-center">
                  <div className="w-[10%] text-left">x {product.quantity}</div>
                  <div className="w-[60%] text-ellipsis line-clamp-2">
                    {product.name}
                  </div>
                  <div className="w-[30%] text-right">
                    {FormatMoney(product.price * product.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>
          <div>
            <hr className="w-full my-4" />
            <div className="flex">
              <div className="w-[70%]">Tạm tính</div>
              {
                <div className="w-[30%] text-right">
                  {FormatMoney(
                    data?.reduce((total, item) => total + item.totalPrice, 0)
                  )}
                </div>
              }
            </div>
            <div className="flex">
              <div className="w-[70%]">Phí vận chuyển</div>
              <div className="w-[30%] text-right">
                {FormatMoney(
                  deliveryMethod?.reduce(
                    (total, item) =>
                      item.checked ? total + item.price : total,
                    0
                  ) * data?.length
                )}
              </div>
            </div>
          </div>
          <div>
            <hr className="w-full my-4" />
            <div className="flex">
              <div className="w-[70%]">Tổng cộng</div>
              <div className="w-[30%] text-right text-red-500 font-bold text-lg">
                {FormatMoney(
                  data?.reduce((total, item) => total + item.totalPrice, 0) +
                    deliveryMethod?.reduce(
                      (total, item) =>
                        item.checked ? total + item.price : total,
                      0
                    )
                )}
              </div>
            </div>
          </div>
          <div className={showPaypal}>
            <hr className="w-full my-4" />
            <Paypal
              amount={
                data?.reduce((total, item) => total + item.totalPrice, 0) +
                deliveryMethod?.reduce(
                  (total, item) => (item.checked ? total + item.price : total),
                  0
                )
              }
              callback={() => CraeteBill()}
            />
          </div>
          <div>
            <hr className="w-full my-4" />
            {/* Button Đặt hàng */}
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                onClick={(e) => HandleOrder()}
              >
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
