import React from "react";
import Image from "next/image";

function CardProduct(props: any) {
  const { data } = props;
  const DetailProduct = () => {
    window.location.href = "/product/" + data._id;
  };
  return (
    <div
      className="bg-white rounded-md border-2 border-gray-200 mx-2 cursor-pointer hover:shadow-xl"
      onClick={(e) => DetailProduct()}
    >
      <img
        src={data.avatar[0]}
        alt=""
        className="rounded-t-md inset-0 w-full h-full object-cover"
      />
      <div className="px-2  mt-2">
        <div className="text-ellipsis line-clamp-3 h-[64px] mb-4 text-sm">
          {data.productName}
        </div>
        <div className="flex justify-between items-center font-bold mb-2">
          <div className={data.type == "sell" ? "" : "hidden"}>
            {Number(data.price).toLocaleString("en-US", {})} <sup>đ</sup>
          </div>
          <div className="text-sm leading-7">Còn lại: {data.quantity}</div>
        </div>
        <hr />
        <div className="text-center my-2">
          {data.type == "sell" ? "Hàng bán" : "Hàng tặng"}
        </div>
      </div>
    </div>
  );
}

export default CardProduct;
