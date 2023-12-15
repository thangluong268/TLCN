"use client";
import Modal from "@/components/Modal";
import SortTable from "@/components/SortTable";
import {
  APIGetCountBillByStatusUser,
  APIGetListBillUser,
  APIUpdateBill,
} from "@/services/Bill";
import Toast from "@/utils/Toast";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import React from "react";
interface Invoice {
  status: string;
  title: string;
  value: number;
}
interface TableInvoice {
  id: string;
  productName: string[];
  storeName: string;
  price: number;
  recievedDate: string;
}

function Info() {
  const [status, setStatus] = React.useState("NEW");
  const [invoice, setInvoice] = React.useState<Invoice[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [data, setData] = React.useState<TableInvoice[]>([] as TableInvoice[]);
  const [isShow, setIsShow] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const [typeMes, setTypeMes] = React.useState<string>("");

  const [currentId, setCurrentId] = React.useState("");
  interface TypeObject {
    [key: string]: {
      mes: string;
      func: () => void;
    };
  }

  const type: TypeObject = {
    upGrade: {
      mes: "Bạn có chắc chắn muốn HOÀN ĐƠN này không?",
      func: () => UpGrade(),
    },
    cancel: {
      mes: "Bạn có muốn HUỶ ĐƠN này không?",
      func: () => Cancel(),
    },
  };
  const Cancel = async () => {
    await APIUpdateBill(currentId, "CANCELLED").then((res) => {
      if (res.status == 200 || res.status == 201) {
        Toast("success", "Huỷ đơn thành công", 2000);
        setIsShow(false);
        setChanged(!changed);
        setStatus("CANCELLED");
      } else {
        Toast("error", "Chuyển thất bại", 2000);
      }
    });
  };
  const UpGrade = async () => {
    await APIUpdateBill(currentId, "RETURNED").then((res) => {
      if (res.status == 200 || res.status == 201) {
        Toast("success", "Hoàn đơn thành công", 2000);
        setIsShow(false);
        setChanged(!changed);
      } else {
        Toast("error", "Hoàn đơn thất bại", 2000);
      }
    });
  };
  React.useEffect(() => {
    const getInvoice = async () => {
      const res = await APIGetCountBillByStatusUser();
      setInvoice(res.metadata.data);
    };
    getInvoice();
  }, [changed]);

  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Tên sản phẩm",
      sort: false,
      name: "productName",
    },
    {
      title: "Tên cửa hàng",
      sort: false,
      name: "storeName",
    },
    {
      title: "Giá",
      sort: false,
      name: "price",
    },
    {
      title: "Dự kiến nhận hàng",
      sort: false,
      name: "recievedDate",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  React.useEffect(() => {
    const getBill = async () => {
      const res = await APIGetListBillUser(page || 1, 2, status);
      setTotalPage(res.metadata.total);
      console.log(res.metadata.data.fullData);
      var arr = [] as TableInvoice[];
      res.metadata.data.fullData.map((lstProduct: any, index: number) => {
        var arrBill = {} as TableInvoice;
        arrBill.id = lstProduct._id;
        const createdAtDate = new Date(lstProduct.createdAt);
        createdAtDate.setDate(createdAtDate.getDate() + 3);
        arrBill.recievedDate = formatToDDMMYYYY(createdAtDate);
        arrBill.storeName = lstProduct.storeInfo?.name;
        arrBill.price = lstProduct.totalPrice;
        arrBill.productName = [] as string[];
        lstProduct.listProductsFullInfo?.map((item: any, index: number) => {
          if (item.product) {
            arrBill.productName?.push(
              item.product.productName + " x " + item.subInfo.quantity
            );
          }
        });
        arr.push(arrBill);
      });
      setData(arr);
    };
    getBill();
  }, [status, page]);

  return (
    <div className="min-h-screen px-[150px] my-4">
      <div className=" bg-white rounded-md py-2 px-4 mb-5">
        <div className="flex justify-center items-center my-5">
          {invoice.map((item, index) => (
            <div
              className="flex flex-col relative group cursor-pointer"
              key={index}
              onClick={() => setStatus(item.status)}
            >
              <div className="flex items-center">
                <div className="relative w-24 h-24 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <div
                    className={`${
                      item.status == status && "animate-ping"
                    } absolute w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:animate-ping`}
                  ></div>
                  <div className="text-2xl font-bold text-gray-500">
                    {item.value}
                  </div>
                </div>
                {index != invoice.length - 1 && (
                  <>
                    <div
                      className={`border-t-2 w-[50px] h-1 group-hover:hidden`}
                    ></div>
                    <div className="w-[50px] h-[2px] hidden group-hover:bg-gray-500 group-hover:block"></div>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500 text-center w-24">
                {item.title}
              </div>
            </div>
          ))}
        </div>
        <SortTable
          currentPage={page}
          setPage={(data) => setPage(data)}
          title={status == "NEW" ? arrTitle : arrTitle.slice(0, 5)}
          totalPage={totalPage}
        >
          {data?.map((item, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
              >
                {index + 1 + (page - 1) * 2}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
              >
                <div className="flex flex-col">
                  {item.productName?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-center">{item.storeName}</td>
              <td className="px-6 py-4 text-center">{item.price}</td>

              <td className="px-6 py-4 text-center">{item.recievedDate}</td>
              {status == "NEW" && (
                <td className="px-6 py-4 text-center">
                  <div
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer mb-2"
                    onClick={(e) => {
                      setIsShow(true);
                      setCurrentId(item.id);
                      setTypeMes("upGrade");
                    }}
                  >
                    Hoàn đơn
                  </div>
                  <div
                    className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer mb-2"
                    onClick={(e) => {
                      setIsShow(true);
                      setCurrentId(item.id);
                      setTypeMes("cancel");
                    }}
                  >
                    Huỷ đơn
                  </div>
                </td>
              )}
            </tr>
          ))}
        </SortTable>

        <Modal
          isShow={isShow}
          setIsShow={(data: any) => setIsShow(data)}
          confirm={() => {
            type[typeMes]?.func();
          }}
          title="Thay đổi trạng thái"
        >
          <div className="font-bold text-lg text-center">
            {type[typeMes]?.mes}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Info;
