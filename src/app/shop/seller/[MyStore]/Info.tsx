import { APIGetMyStore, APIUpdateMyStore } from "@/services/Store";
import { APIUploadImage } from "@/services/UploadImage";
import ConvertDate from "@/utils/ConvertDate";
import FormatMoney from "@/utils/FormatMoney";
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
  createdAt: string;
  warningCount: number;
}

interface StoreProps {
  _id: string;
  avatar: string;
  name: string;
  address: string;
  phoneNumber: string[];
  description: string;
  warningCount: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userId: string;
}
interface DetailStore {
  averageStar: number;
  totalFeedback: number;
  totalFollow: number;
  totalRevenue: number;
  totalDelivered: number;
}

interface Props {
  storeProps: StoreProps;
  detailStore: DetailStore;
  setIsShowDetail: (data: boolean) => void;
}

function Info(props: Props) {
  const { storeProps = null, detailStore, setIsShowDetail } = props;
  const [data, setData] = React.useState<Store>({} as Store);
  const [description, setDescription] = React.useState<string>("" as string);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetMyStore();
      setData({
        id: res.metadata.data._id,
        name: res.metadata.data.name,
        address: res.metadata.data.address,
        phoneNumber: res.metadata.data.phoneNumber,
        avatar: res.metadata.data.avatar,
        createdAt: ConvertDate(res.metadata.data.createdAt),
        warningCount: +res.metadata.data.warningCount,
      });
      setDescription(res.metadata.data.description);
      const avatar = document.getElementById("avatar-preview");
      if (avatar) {
        avatar.setAttribute("src", res.metadata.data.avatar);
        avatar.hidden = false;
      }
    };
    if (storeProps) {
      setData({
        id: storeProps._id,
        name: storeProps.name,
        address: storeProps.address,
        phoneNumber: storeProps.phoneNumber,
        avatar: storeProps.avatar,
        createdAt: ConvertDate(storeProps.createdAt),
        warningCount: storeProps.warningCount,
      });
      setDescription(storeProps.description);
      const avatar = document.getElementById("avatar-preview");
      if (avatar) {
        avatar.setAttribute("src", storeProps.avatar);
        avatar.hidden = false;
      }
    } else {
      fetchData();
    }
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
      description: description,
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
    setDescription(value);
  };
  return (
    <div className="flex flex-col w-full bg-white rounded-md py-2 px-4 mb-5">
      {storeProps && (
        <div className="flex justify-end">
          <button
            type="button"
            className="flex-shrink-0 flex justify-center items-center h-8 w-8 rounded-lg text-white bg-gray-400 hover:bg-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
            onClick={() => setIsShowDetail(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="flex-shrink-0 w-4 h-4 text-center"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mx-auto mt-5">
        <div
          className="w-[200px] h-[200px] border border-[#d9d9d9] rounded-full flex justify-center items-center cursor-pointer"
          onClick={(e) => {
            if (storeProps) return;
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
              disabled={storeProps ? true : false}
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
              disabled={storeProps ? true : false}
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
              disabled={storeProps ? true : false}
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
              disabled={storeProps ? true : false}
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
        <div className="flex flex-col items-center pb-10 col-span-2 w-full">
          {storeProps ? (
            <>
              <div className="text-2xl font-bold text-blue-600 mt-10">
                Mô tả cửa hàng:
              </div>
              <div
                className="text-justify indent-8"
                dangerouslySetInnerHTML={{ __html: description }}
              ></div>
            </>
          ) : (
            <>
              <p className=" font-semibold">Mô tả cửa hàng</p>
              <ReactQuill
                className="w-full "
                theme="snow"
                value={description}
                onChange={handleDescriptionChange}
              />
            </>
          )}
        </div>
      </div>
      {storeProps ? (
        <>
          <div className="text-2xl font-bold text-blue-600 mt-10">
            Thông tin khác
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-5">
            <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
              <p className=" font-semibold">Đánh giá (sao)</p>
              <p className="">{detailStore.averageStar}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
              <p className=" font-semibold">Người theo dõi</p>
              <p className="">{detailStore.totalFollow}</p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
              <p className=" font-semibold">Đơn bán</p>
              <p className="">{detailStore.totalDelivered}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
              <p className=" font-semibold">Bình luận</p>
              <p className="">{detailStore.totalFeedback}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
              <p className=" font-semibold">Doanh thu</p>
              <p className="">{FormatMoney(detailStore.totalRevenue)}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all ease-in">
              <p className=" font-semibold text-red-500">Cảnh báo</p>
              <p className="">{data.warningCount}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center my-5">
          <button
            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-500"
            onClick={(e) => UpdateInfo()}
          >
            Cập nhật thông tin
          </button>
        </div>
      )}
    </div>
  );
}

export default Info;
