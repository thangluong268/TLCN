"use client";
import Input from "@/components/Input";
import { CREATESTORE } from "@/constants/CreateStore";
import { APICreate, APIGetMyStore } from "@/services/Store";
import { APIUploadImage } from "@/services/UploadImage";
import CheckValidInput from "@/utils/CheckValidInput";
import Toast from "@/utils/Toast";
import React from "react";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
function CreateStore() {
  const [acceptPolicy, setAcceptPolicy] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null;
    setUser(user);
  }, []);
  const [store, setStore] = React.useState({
    address:
      user?.providerData[0].address?.filter(
        (item: any) => item.isDefault == true
      )[0]?.name || "Cửa hàng mặc định",
    name: "",
    phoneNumber1: user?.providerData[0].phone || "",
    phoneNumber2: "",
    description: "",
    avatar: "",
  });
  const handleDescriptionChange = (value: string) => {
    setStore({ ...store, description: value });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const store = await APIGetMyStore();
      if (store.status == 200 || store.status == 201) {
        Toast("error", "Bạn đã có cửa hàng", 2000);
        setTimeout(() => {
          window.location.href = "/store/" + store.metadata.data._id;
        }, 2000);
      }
    };
    fetchData();
  }, []);

  const CheckValid = () => {
    var isValid = true;
    if (store.address === "") {
      isValid = false;
      document
        .getElementById(`formCreate-address`)
        ?.classList.add("border-red-500");
      document.getElementById(`errMes-address`)!.innerHTML =
        "Không được để trống";
    }
    if (store.name === "") {
      isValid = false;
      document
        .getElementById(`formCreate-name`)
        ?.classList.add("border-red-500");
      document.getElementById(`errMes-name`)!.innerHTML = "Không được để trống";
    }
    if (store.phoneNumber2 === "") {
      isValid = false;
      document
        .getElementById(`formCreate-phoneNumber2`)
        ?.classList.add("border-red-500");
      document.getElementById(`errMes-phoneNumber2`)!.innerHTML =
        "Không được để trống";
    }
    if (!isValid) {
      Toast("error", "Bạn chưa nhập đủ thông tin", 2000);
      return false;
    }
    if (store.phoneNumber1 === store.phoneNumber2) {
      Toast("error", "Số điện thoại không được trùng nhau", 2000);
      return false;
    }
    if (store.avatar === "") {
      Toast("error", "Bạn chưa chọn ảnh", 2000);
      return false;
    }

    if (store.description === "") {
      Toast("error", "Bạn chưa mô tả cửa hàng", 2000);
      return false;
    }

    if (!acceptPolicy) {
      Toast("error", "Bạn chưa đồng ý với chính sách", 2000);
      return false;
    }

    var check = false;
    const elementInValid = document.querySelectorAll("[id^='errMes-']");
    elementInValid.forEach((item) => {
      if (item.innerHTML !== "") {
        Toast("error", "Thông tin chưa chính xác", 2000);
        check = true;
      }
    });
    if (check) {
      return false;
    }

    return true;
  };
  const CreateStore = async () => {
    if (CheckValid()) {
      // Đưa phoneNumber vào mảng
      const phoneNumber = [];
      phoneNumber.push(store.phoneNumber1);
      phoneNumber.push(store.phoneNumber2);
      let formData = new FormData();
      formData.append("file", store.avatar);
      const rs = await APIUploadImage(formData);
      const storeRes = await APICreate({
        address: store.address,
        name: store.name,
        phoneNumber: phoneNumber,
        description: store.description,
        avatar: rs.metadata.data.url,
      });
      if (storeRes.status === 200 || storeRes.status === 201) {
        Toast("success", "Tạo cửa hàng thành công", 2000);
      } else {
        Toast("error", storeRes.message, 2000);
      }
      console.log(storeRes);
      window.location.href = "/store/" + storeRes.metadata?.data._id;
    }
  };
  // Check valid input
  return (
    <div className="min-h-screen flex px-[150px] my-4">
      <div className="bg-white rounded-md p-4 mb-5 w-full">
        <div className="text-center text-blue-500 font-bold text-2xl">
          TẠO CỬA HÀNG CỦA BẠN
        </div>
        <div className="flex mt-5">
          <div
            className="w-[16%] h-[165px] border border-[#d9d9d9] rounded-full flex justify-center items-center cursor-pointer mr-3"
            onClick={(e) => {
              const input = document.getElementById("upload-avatar");
              if (input) {
                input.click();
              }
            }}
          >
            <div className="text-[50px] text-[#d9d9d9]" id="symbol-upload">
              <span className="text-[#d9d9d9]">+</span>
            </div>
            <img
              src=""
              id="avatar-preview"
              alt=""
              className="rounded-full h-full fit-cover w-full"
              hidden
            />
          </div>
          {/* Ẩn */}
          <input
            id="upload-avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setStore({ ...store, avatar: file as any });
                const reader = new FileReader();
                reader.onloadend = function () {
                  const avatar = document.getElementById("avatar-preview");
                  const symbol = document.getElementById("symbol-upload");
                  if (avatar) {
                    avatar.setAttribute("src", reader.result as string);
                    avatar.hidden = false;
                  }
                  if (symbol) {
                    symbol.hidden = true;
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          <div className="grid grid-cols-2 w-full gap-x-2 mx-2">
            {CREATESTORE.map((item, index) => (
              <Input label={item.label} required={true} key={index}>
                <input
                  id={`formCreate-${item.name}`}
                  type="text"
                  className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
                  placeholder={item.placeholder}
                  name={item.name}
                  disabled={item.name === "phoneNumber1" ? true : false}
                  value={store[item.name as keyof typeof store]}
                  onChange={(e) =>
                    setStore({ ...store, [item.name]: e.target.value })
                  }
                  onBlur={(e) => {
                    const result = CheckValidInput({
                      [`${item.identify}`]: e.target.value,
                    });
                    if (result !== "") {
                      document
                        .getElementById(`formCreate-${item.name}`)
                        ?.classList.add("border-red-500");
                    } else {
                      document
                        .getElementById(`formCreate-${item.name}`)
                        ?.classList.remove("border-red-500");
                    }
                    document.getElementById(`errMes-${item.name}`)!.innerHTML =
                      result;
                  }}
                />
                <span
                  id={`errMes-${item.name}`}
                  className="text-red-500 text-sm"
                ></span>
              </Input>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="font-bold text-lg">Mô tả cửa hàng của bạn</div>
          <ReactQuill
            theme="snow"
            value={store.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="mt-4">
          <div className="flex">
            <input
              type="checkbox"
              name=""
              id=""
              className="w-5 h-5 mr-2"
              onChange={(e) => setAcceptPolicy(!acceptPolicy)}
            />
            <div>Tôi đồng ý với chính sách bên dưới</div>
          </div>
          <p
            className={`outline outline-offset-2 outline-2 ${
              acceptPolicy ? "outline-green-600" : "outline-gray-600"
            } rounded-sm p-2 mt-2`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            corrupti voluptas placeat, laborum vero possimus quasi minus
            reprehenderit provident esse quae harum quam optio modi nostrum
            ipsum reiciendis cum explicabo.
          </p>
        </div>
        <div className="flex justify-center mt-5">
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2"
            onClick={(e) => CreateStore()}
          >
            Tạo cửa hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateStore;
