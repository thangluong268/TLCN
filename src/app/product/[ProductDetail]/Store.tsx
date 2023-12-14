import { APIGetListProductOtherInStore } from "@/services/Product";
import { APIGetStoreById, APIGetStoreReputation } from "@/services/Store";
import { useParams } from "next/navigation";
import React from "react";
import { FaPlus, FaTelegramPlane } from "react-icons/fa";

function Store({ product }: any) {
  const params = useParams();
  const [productsOrderCurrent, setProductsOrderCurrent] = React.useState([]);
  const [storeInfo, setStoreInfo] = React.useState({
    avatar: "",
    averageStar: 0,
    totalFeedback: 0,
    totalFollow: 0,
    name: "",
  });
  React.useEffect(() => {
    // Promise all
    const fectData = async () => {
      product.storeId &&
        (await Promise.all([
          APIGetStoreReputation(product.storeId),
          APIGetStoreById(product.storeId),
        ]).then((res: any) => {
          setStoreInfo({
            avatar: res[1].metadata.data.avatar,
            name: res[1].metadata.data.name,
            averageStar: res[0].metadata.averageStar,
            totalFeedback: res[0].metadata.totalFeedback,
            totalFollow: res[0].metadata.totalFollow,
          });
        }));
    };
    fectData();
  }, [product.storeId]);
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListProductOtherInStore(
        product.storeId,
        params.ProductDetail
      ).then((res) => {
        setProductsOrderCurrent(res.metadata.data);
      });
    };
    fetchData();
  }, [product.storeId]);
  return (
    <div className="mb-3 bg-white rounded-md p-4 w-full col-span-4 flex flex-col border-solid ">
      <p className="text-lg font-bold mb-2">Thông tin người bán:</p>
      <div className="mb-2 flex items-center justify-between border-[#D2E0FB] border-2 p-2 rounded-md">
        <div className="flex items-center">
          <img
            src={storeInfo.avatar!}
            width={50}
            height={50}
            className="rounded-full mr-2"
            alt=""
          />
          <div className="flex flex-col">
            <div className="font-bold">{storeInfo.name}</div>
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 text-yellow-300 mr-1 mb-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <p className="ml-1  text-gray-900 dark:text-white">
                {storeInfo.averageStar || 0}
              </p>
              <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
              <div className=" text-gray-900 dark:text-white">
                {storeInfo.totalFeedback} đánh giá
              </div>
              <span className="mx-2">|</span>
              <span className="">Theo dõi: {storeInfo.totalFollow}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <button
            type="button"
            className="flex justify-center text-white mb-2 items-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <FaTelegramPlane className="mr-3" />
            <span>Chat</span>
          </button>
          <button
            type="button"
            className="flex justify-center items-center w-full py-1.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <FaPlus className="mr-3" />
            <span>Theo dõi</span>
          </button>
        </div>
      </div>
      <p className="text-lg font-bold mb-2">Các sản phẩm khác của cửa hàng:</p>
      <div className="grid grid-cols-6 gap-4">
        {productsOrderCurrent.map((item: any, index: number) => (
          <div
            key={index}
            className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            onClick={(e) => (window.location.href = `/product/${item._id}`)}
          >
            <img
              src={item?.avatar[0]}
              className="rounded-t-md inset-0 w-full h-[214px] object-cover hover:shadow-xl"
              alt=""
            />
            <div className="px-2  mt-2">
              <div className="text-ellipsis line-clamp-3 h-[64px] mb-4 text-sm">
                {item.productName}
              </div>
              <div className="flex justify-between items-center font-bold mb-2">
                <div className={item.price != 0 ? "" : "hidden"}>
                  {Number(item.price).toLocaleString("en-US", {})} <sup>đ</sup>
                </div>
                <div className="text-sm leading-7">
                  Còn lại: {item.quantity}
                </div>
              </div>
              <hr />
              <div className="text-center my-2">
                {item.price != 0 ? "Hàng bán" : "Hàng tặng"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
