"use client";
import SortTable from "@/components/SortTable";
import {
  APIGetListProductFavorite,
  APIGetListStoreFollow,
} from "@/services/User";
import FormatMoney from "@/utils/FormatMoney";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import React from "react";
interface Product {
  _id: string;
  avatar: string[];
  quantity: number;
  productName: string;
  price: number;
  description: string;
  categoryId: string;
  keywords: string[];
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  storeId: string;
  categoryName: string;
  storeName: string;
  quantitySold: number;
  quantityGive: number;
  revenue: number;
}

interface ListProduct {
  total: number;
  data: Product[];
}
function ProductFavorite() {
  const [page, setPage] = React.useState<number>(1);

  const [listProduct, setListProduct] = React.useState<ListProduct>(
    {} as ListProduct
  );

  const arrTitleProduct = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Sản phẩm",
      sort: false,
      name: "name",
    },
    {
      title: "Số lượng còn lại",
      sort: false,
      name: "quantity",
    },
    {
      title: "Giá",
      sort: false,
      name: "price",
    },
    {
      title: "Danh mục",
      sort: false,
      name: "category",
    },
    {
      title: "Cửa hàng",
      sort: false,
      name: "store",
    },
  ];
  React.useEffect(() => {
    const getListProduct = async () => {
      const res = await APIGetListProductFavorite(page, 20);
      setListProduct(res.metadata);
    };
    getListProduct();
  }, [page]);
  return (
    <div className="min-h-screen my-5 px-3">
      <div className="text-2xl font-bold text-center mb-5">
        Danh sách sản phẩm đã yêu thích
      </div>
      <SortTable
        title={arrTitleProduct}
        totalPage={listProduct.total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={20}
      >
        {listProduct.data?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td
              className="px-6 py-4 text-center cursor-pointer"
              onClick={(e) => (window.location.href = `/product/${item._id}`)}
            >
              {item.productName}
            </td>
            <td className="px-6 py-4 text-center">{item.quantity}</td>
            <td className="px-6 py-4 text-center">{FormatMoney(item.price)}</td>
            <td className="px-6 py-4 text-center">{item.categoryName}</td>
            <td className="px-6 py-4 text-center">{item.storeName}</td>
          </tr>
        ))}
      </SortTable>
    </div>
  );
}

export default ProductFavorite;
