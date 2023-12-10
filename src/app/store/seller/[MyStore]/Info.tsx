import { APIGetMyStore, APIUpdateMyStore } from "@/services/Store";
import { APIUploadImage } from "@/services/UploadImage";
import ConvertDate from "@/utils/ConvertDate";
import Toast from "@/utils/Toast";
import React from "react";
import { FaAddressCard, FaPhone } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
interface Store {
  id: string;
  name: string;
  address: string;
  phoneNumber: string[];
  avatar: string;
  description: string;
  createdAt: string;
  warningCount: string;
}

function Info() {
  const [data, setData] = React.useState<Store>({} as Store);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetMyStore();
      console.log(res);
      setData({
        id: res.metadata.data._id,
        name: res.metadata.data.name,
        address: res.metadata.data.address,
        phoneNumber: res.metadata.data.phoneNumber,
        avatar: res.metadata.data.avatar,
        description: res.metadata.data.description,
        createdAt: ConvertDate(res.metadata.data.createdAt),
        warningCount: res.metadata.data.warningCount,
      });
      const avatar = document.getElementById("avatar-preview");
      if (avatar) {
        avatar.setAttribute("src", res.metadata.data.avatar);
        avatar.hidden = false;
      }
    };
    fetchData();
  }, []);
  const UpdateInfo = async () => {
    document.getElementById("loading-page")?.classList.remove("hidden");
    var avatarUrl = "";
    if (typeof data.avatar != "string") {
      let formData = new FormData();
      formData.append("file", data.avatar);
      const res = await APIUploadImage(formData);
      if (res.status == 200 || res.status == 201) {
        avatarUrl = res.metadata.data.url;
      }
    }
    await APIUpdateMyStore({
      avatar: avatarUrl || data.avatar,
      name: data.name,
      phone: data.phoneNumber,
      address: data.address,
      description: data.description,
    }).then((res) => {
      if (res.status == 200 || res.status == 201) {
        document.getElementById("loading-page")?.classList.add("hidden");
        Toast("success", "Cập nhật thành công", 2000);
      } else {
        Toast("error", "Cập nhật thất bại", 2000);
      }
    });
  };
  const handleDescriptionChange = (value: string) => {
    setData({ ...data, description: value });
  };
  return (
    <div className="flex flex-col w-full bg-white rounded-md py-2 px-4 mb-5">
      <div className="mx-auto mt-5">
        <div
          className="w-[200px] h-[200px] border border-[#d9d9d9] rounded-full flex justify-center items-center cursor-pointer"
          onClick={(e) => {
            const input = document.getElementById("upload-avatar");
            if (input) {
              input.click();
            }
          }}
        >
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
              setData({ ...data, avatar: file as any });
              const reader = new FileReader();
              reader.onloadend = function () {
                const avatar = document.getElementById("avatar-preview");
                if (avatar) {
                  avatar.setAttribute("src", reader.result as string);
                  avatar.hidden = false;
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      <div className="font-bold text-3xl text-center mt-4">
        {data.name?.toUpperCase()}
      </div>
      <div className="text-sm text-gray-500 text-center mt-2">
        (Tham gia từ: {data.createdAt})
      </div>
      <div className="text-sm  text-center mt-2 text-red-500">
        (Số lần cảnh báo:
        <span className="font-bold">{data.warningCount}</span>)
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
        <div className="flex items-center p-4 bg-white shadow-md rounded-md">
          <div className="text-2xl mr-3">
            <FaRegCircleUser />
          </div>

          <div className="flex flex-col w-full">
            <p className=" font-semibold">Tên cửa hàng</p>
            <input
              type="text"
              value={data.name}
              className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="flex items-center p-4 bg-white shadow-md rounded-md">
          <div className="text-2xl mr-3">
            <FaAddressCard />
          </div>

          <div className="flex flex-col w-full">
            <p className=" font-semibold">Địa chỉ</p>
            <input
              type="text"
              value={data.address}
              className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="flex items-center p-4 bg-white shadow-md rounded-md">
          <div className="text-2xl mr-3">
            <FaPhone />
          </div>
          <div className="flex flex-col w-full">
            <p className=" font-semibold">Số điện thoại 1</p>
            <input
              type="text"
              value={data.phoneNumber && data.phoneNumber[0]}
              className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
              onChange={(e) => {
                const phone = data.phoneNumber;
                phone[0] = e.target.value as string;
                setData({ ...data, phoneNumber: phone });
              }}
            />
          </div>
        </div>
        <div className="flex items-center p-4 bg-white shadow-md rounded-md">
          <div className="text-2xl mr-3">
            <FaPhone />
          </div>
          <div className="flex flex-col w-full">
            <p className=" font-semibold">Số điện thoại 2</p>
            <input
              type="text"
              value={data.phoneNumber && data.phoneNumber[1]}
              className="w-full border border-[#d9d9d9] rounded-md px-2 py-1"
              onChange={(e) => {
                const phone = data.phoneNumber;
                phone[1] = e.target.value as string;
                setData({ ...data, phoneNumber: phone });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full items-center pb-10 col-span-2 w-full">
          <p className=" font-semibold">Mô tả cửa hàng</p>
          <ReactQuill
            className="w-full "
            theme="snow"
            value={data.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
      <div className="flex justify-center my-5">
        <button
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500"
          onClick={(e) => UpdateInfo()}
        >
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
}

export default Info;
