"use client";
import Star from "@/components/Star";
import { GetProduct } from "@/services/Product";
import ConvertToShortFormat from "@/utils/ConvertToShortFormat";
import { useParams } from "next/navigation";
import React from "react";
import {
  FaHeart,
  FaPlus,
  FaShareAlt,
  FaShopify,
  FaShoppingCart,
  FaTelegramPlane,
} from "react-icons/fa";

function ProductDetail() {
  const [product, setProduct] = React.useState({} as any);
  const [currentImage, setCurrentImage] = React.useState(0);
  const params = useParams();
  React.useEffect(() => {
    const fetchData = async () => {
      const pd = await GetProduct(params.ProductDetail).then((res) => res);
      setProduct(pd);
    };
    fetchData();
  }, []);
  console.log(product);
  return (
    <div className="min-h-screen flex flex-col px-[160px] my-4">
      {product._id && (
        <>
          <div className="mb-3 w-full">
            <div className="grid grid-flow-col grid-cols-10 gap-2">
              <div className="bg-white rounded-md p-4 col-span-4 flex flex-col">
                <div className="rounded-md mb-2 border-solid border-[#D2E0FB] border-2">
                  <img
                    src={product?.avatar[currentImage]}
                    className="w-full h-full object-cover rounded-md"
                    alt=""
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  {/* Create a loop 4 times */}
                  {[1, 2, 3, 4].map((item, index) => {
                    return (
                      <div
                        className={`rounded-md mx-1 border-solid border-[#D2E0FB] border-2 cursor-pointer ${
                          currentImage == index && "border-blue-500"
                        }`}
                        onClick={(e) => setCurrentImage(index)}
                      >
                        <img
                          src={product.avatar[0]}
                          className="w-full h-full object-cover rounded-md"
                          alt=""
                        />
                      </div>
                    );
                  })}
                </div>
                <hr className="my-2" />
                <div className="flex justify-around items-center my-2">
                  <div className="flex">
                    <FaHeart className="text-red-500 text-lg" />
                    <span className="text-sm ms-2">
                      ({ConvertToShortFormat(2102)})
                    </span>
                  </div>
                  <div>
                    <div className="flex cursor-pointer">
                      <FaShareAlt className="text-blue-500 text-lg" />
                      <span className="text-sm ms-2">Chia sẻ</span>
                    </div>
                  </div>
                </div>
                <hr className="my-2" />

                <div className="mt-2 flex items-center">
                  <button
                    type="button"
                    className="flex justify-center mr-2 text-white items-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg py-3  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    <FaShoppingCart className="mr-3" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center w-full text-center py-3 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    <FaShopify className="mr-3" />
                    <span>Mua ngay</span>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-md p-4 col-span-6 flex flex-col">
                <div className="text-xl font-bold text-justify">
                  {product.productName}
                </div>
                <div className="flex items-center mt-4">
                  <svg
                    className="w-4 h-4 text-yellow-300 mr-1 mb-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <p className="ml-1 font-bold text-gray-900 dark:text-white">
                    4.95
                  </p>
                  <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                  <a
                    href="#"
                    className="font-medium text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    73 đánh giá
                  </a>
                  <span className="mx-2">|</span>
                  <span className="">Đã bán: 56</span>
                </div>
                <div className="flex items-center mt-4 text-3xl font-bold">
                  {Number(product.price).toLocaleString("en-US", {})}{" "}
                  <sup>đ</sup>
                </div>
                <div className="flex flex-col mt-4">
                  <div className="font-bold">Mô tả sản phẩm:</div>
                  <div className="ml-3 text-justify indent-8">
                    *Thông số kỹ thuật: - Bộ nhớ mở rộng: RAM 8GB(4GB+4GB) ROM:
                    128GB - Màn hình: IPS LCD 6,6" ,Độ phân giải HD+ - Tần số
                    quét: 90Hz - Dung lượng pin: 5000mAh - Bộ xử lý: Unisoc T606
                    - Sạc Type C *Bộ sản phẩm bao gồm: Bộ sạc, sách HDSD, ốp
                    lưng, tai nghe. Xuất xứ: Trung Quốc Giá sản phẩm trên Tiki
                    đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào
                    loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát
                    sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng
                    kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có
                    giá trị trên 1 triệu đồng)..... *Thông số kỹ thuật: - Bộ nhớ
                    mở rộng: RAM 8GB(4GB+4GB) ROM: 128GB - Màn hình: IPS LCD
                    6,6" ,Độ phân giải HD+ - Tần số quét: 90Hz - Dung lượng pin:
                    5000mAh - Bộ xử lý: Unisoc T606 - Sạc Type C *Bộ sản phẩm
                    bao gồm: Bộ sạc, sách HDSD, ốp lưng, tai nghe. Xuất xứ:
                    Trung Quốc Giá sản phẩm trên Tiki đã bao gồm thuế theo luật
                    hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và
                    địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như
                    phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối
                    với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu
                    đồng).....
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 bg-white rounded-md p-4 w-full col-span-4 flex flex-col border-solid ">
            <p className="text-lg font-bold mb-2">Thông tin người bán:</p>
            <div className="mb-2 flex items-center justify-between border-[#D2E0FB] border-2 p-2 rounded-md">
              <div className="flex items-center">
                <img
                  src={product?.avatar[currentImage]}
                  width={50}
                  height={50}
                  className="rounded-full mr-2"
                  alt=""
                />
                <div className="flex flex-col">
                  <div className="font-bold">{product.storeName}</div>
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
                    <p className="ml-1  text-gray-900 dark:text-white">4.95</p>
                    <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                    <div className=" text-gray-900 dark:text-white">
                      73 đánh giá
                    </div>
                    <span className="mx-2">|</span>
                    <span className="">Theo dõi: 56</span>
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
            <p className="text-lg font-bold mb-2">
              Các sản phẩm khác của cửa hàng:
            </p>
            <div className="grid grid-cols-6 gap-4">
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
              <div className="p-1 rounded-sm flex flex-col hover:cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                <img src={product?.avatar[currentImage]} className="" alt="" />
                <div className="text-ellipsis line-clamp-2 text-sm py-1">
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                  ipsum dolor sit amet{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 bg-white rounded-md p-4 w-full">
            <div className="text-lg font-bold mb-2">Đánh giá sản phẩm:</div>
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex items-center mb-2">
                <svg
                  className="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>

                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  4.95
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  out of
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  5
                </p>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                1,745 lượt đánh giá
              </p>
              <div className="flex items-center mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  5 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{ width: "70%" }} //Tang giam phan tram
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  70%
                </span>
              </div>
              <div className="flex items-center mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  4 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{ width: "17%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  17%
                </span>
              </div>
              <div className="flex items-center mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  3 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{ width: "8%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  8%
                </span>
              </div>
              <div className="flex items-center mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  2 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{ width: "4%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  4%
                </span>
              </div>
              <div className="flex items-center mt-4 justify-center w-full">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  1 star
                </a>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-300 rounded"
                    style={{ width: "1%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  1%
                </span>
              </div>
            </div>
            <hr className="my-6 w-full" />
            <article>
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src={product?.avatar[currentImage]}
                  alt=""
                ></img>
                <div className="font-medium dark:text-white">
                  <p>
                    Jese Leos
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      Joined on August 2014
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={false} />
              </div>

              <p className="my-2 text-gray-500 dark:text-gray-400">
                This is my third Invicta Pro Diver. They are just fantastic
                value for money. This one arrived yesterday and the first thing
                I did was set the time, popped on an identical strap from
                another Invicta and went in the shower with it to test the
                waterproofing....
                <br />
                No problems. This is my third Invicta Pro Diver. They are just
                fantastic value for money. This one arrived yesterday and the
                first thing I did was set the time, popped on an identical strap
                from another Invicta and went in the shower with it to test the
                waterproofing.... No problems.
              </p>
              <div className="flex justify-center items-center">
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
              </div>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            </article>
            <hr className="w-full my-5" />
            <article>
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src={product?.avatar[currentImage]}
                  alt=""
                ></img>
                <div className="font-medium dark:text-white">
                  <p>
                    Jese Leos
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      Joined on August 2014
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={false} />
              </div>

              <p className="my-2 text-gray-500 dark:text-gray-400">
                This is my third Invicta Pro Diver. They are just fantastic
                value for money. This one arrived yesterday and the first thing
                I did was set the time, popped on an identical strap from
                another Invicta and went in the shower with it to test the
                waterproofing....
                <br />
                No problems. This is my third Invicta Pro Diver. They are just
                fantastic value for money. This one arrived yesterday and the
                first thing I did was set the time, popped on an identical strap
                from another Invicta and went in the shower with it to test the
                waterproofing.... No problems.
              </p>
              <div className="flex justify-center items-center">
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
              </div>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            </article>
            <hr className="w-full my-5" />
            <article>
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src={product?.avatar[currentImage]}
                  alt=""
                ></img>
                <div className="font-medium dark:text-white">
                  <p>
                    Jese Leos
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      Joined on August 2014
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={false} />
              </div>

              <p className="my-2 text-gray-500 dark:text-gray-400">
                This is my third Invicta Pro Diver. They are just fantastic
                value for money. This one arrived yesterday and the first thing
                I did was set the time, popped on an identical strap from
                another Invicta and went in the shower with it to test the
                waterproofing....
                <br />
                No problems. This is my third Invicta Pro Diver. They are just
                fantastic value for money. This one arrived yesterday and the
                first thing I did was set the time, popped on an identical strap
                from another Invicta and went in the shower with it to test the
                waterproofing.... No problems.
              </p>
              <div className="flex justify-center items-center">
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
              </div>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            </article>
            <hr className="w-full my-5" />
            <article>
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src={product?.avatar[currentImage]}
                  alt=""
                ></img>
                <div className="font-medium dark:text-white">
                  <p>
                    Jese Leos
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      Joined on August 2014
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={false} />
              </div>

              <p className="my-2 text-gray-500 dark:text-gray-400">
                This is my third Invicta Pro Diver. They are just fantastic
                value for money. This one arrived yesterday and the first thing
                I did was set the time, popped on an identical strap from
                another Invicta and went in the shower with it to test the
                waterproofing....
                <br />
                No problems. This is my third Invicta Pro Diver. They are just
                fantastic value for money. This one arrived yesterday and the
                first thing I did was set the time, popped on an identical strap
                from another Invicta and went in the shower with it to test the
                waterproofing.... No problems.
              </p>
              <div className="flex justify-center items-center">
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
              </div>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            </article>
            <hr className="w-full my-5" />
            <article>
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src={product?.avatar[currentImage]}
                  alt=""
                ></img>
                <div className="font-medium dark:text-white">
                  <p>
                    Jese Leos
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      Joined on August 2014
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={false} />
              </div>

              <p className="my-2 text-gray-500 dark:text-gray-400">
                This is my third Invicta Pro Diver. They are just fantastic
                value for money. This one arrived yesterday and the first thing
                I did was set the time, popped on an identical strap from
                another Invicta and went in the shower with it to test the
                waterproofing....
                <br />
                No problems. This is my third Invicta Pro Diver. They are just
                fantastic value for money. This one arrived yesterday and the
                first thing I did was set the time, popped on an identical strap
                from another Invicta and went in the shower with it to test the
                waterproofing.... No problems.
              </p>
              <div className="flex justify-center items-center">
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
              </div>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            </article>
            <hr className="w-full my-5" />
            <article>
              <div className="flex items-center mb-4">
                <img
                  className="w-10 h-10 me-4 rounded-full"
                  src={product?.avatar[currentImage]}
                  alt=""
                ></img>
                <div className="font-medium dark:text-white">
                  <p>
                    Jese Leos
                    <time
                      dateTime="2014-08-16 19:00"
                      className="block text-sm text-gray-500 dark:text-gray-400"
                    >
                      Joined on August 2014
                    </time>
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={true} />
                <Star state={false} />
              </div>

              <p className="my-2 text-gray-500 dark:text-gray-400">
                This is my third Invicta Pro Diver. They are just fantastic
                value for money. This one arrived yesterday and the first thing
                I did was set the time, popped on an identical strap from
                another Invicta and went in the shower with it to test the
                waterproofing....
                <br />
                No problems. This is my third Invicta Pro Diver. They are just
                fantastic value for money. This one arrived yesterday and the
                first thing I did was set the time, popped on an identical strap
                from another Invicta and went in the shower with it to test the
                waterproofing.... No problems.
              </p>
              <div className="flex justify-center items-center">
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
                <img
                  src={product?.avatar[currentImage]}
                  alt=""
                  width={100}
                  height={100}
                  className="mx-2 cursor-pointer"
                />
              </div>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  19 người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            </article>
            <hr className="w-full my-5" />
          </div>
          <div className="mb-3 bg-white rounded-md p-4 w-full">3</div>
          <div className="mb-3 bg-white rounded-md p-4 w-full">4</div>
          <div className="mb-3 bg-white rounded-md p-4 w-full">5</div>
        </>
      )}
    </div>
  );
}

export default ProductDetail;
