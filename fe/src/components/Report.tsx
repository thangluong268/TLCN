import React from "react";
import SortTable from "./SortTable";
import {
  APIDeleteReport,
  APIReportAdmin,
  APIUpdateReport,
} from "@/services/Report";
import ConvertDate from "@/utils/ConvertDate";
import Modal from "./Modal";
import Toast from "@/utils/Toast";
interface Props {
  type: string;
  status: boolean;
}

interface Report {
  _id: string;
  userName: string;
  name: string;
  content: string;
  createdAt: string;
}
interface TypeObject {
  [key: string]: {
    mes: string;
    func: () => void;
  };
}

function Report(props: Props) {
  const { type, status } = props;
  const [page, setPage] = React.useState<any>(1);
  const [total, setTotal] = React.useState<any>(0);
  const [listReport, setListReport] = React.useState<Report[]>([]);
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const [currentId, setCurrentId] = React.useState<string>("");
  const [typeMes, setTypeMes] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      console.log("status", status);
      await APIReportAdmin(page || 1, 20, type, status).then((res) => {
        if (res.status == 200 || res.status == 201) {
          setTotal(res.metadata.total);
          setListReport(
            res.metadata.data.map((item: any) => {
              return {
                ...item,
                name: item.productName || item.storeName,
              };
            })
          );
        }
      });
    };
    fetchData();
  }, [status]);
  const arrTitle = [
    {
      title: "STT",
      sort: false,
      name: "index",
    },
    {
      title: "Người báo cáo",
      sort: false,
      name: "user",
    },
    {
      title: type == "product" ? "Sản phẩm bị báo cáo" : "Cửa hàng bị báo cáo",
      sort: false,
      name: "product",
    },
    {
      title: "Lý do",
      sort: false,
      name: "reason",
    },
    {
      title: "Ngày tạo",
      sort: false,
      name: "createdAt",
    },
    {
      title: "Thao tác",
      sort: false,
      name: "action",
    },
  ];
  const typeOb: TypeObject = {
    ok: {
      mes: "Bạn chắn chắn ĐỒNG Ý báo cáo này?",
      func: () => OK(),
    },
    refuse: {
      mes: "Bạn chắn chắn TỪ CHỐI báo cáo này?",
      func: () => Refuse(),
    },
  };
  const OK = async () => {
    await APIUpdateReport(currentId).then((res) => {
      if (res.status == 200 || res.status == 201) {
        setIsShow(false);
        Toast(
          "success",
          typeMes == "ok"
            ? "Thao tác ĐỒNG Ý thành công"
            : "Thao tác TỪ CHỐI thành công",
          2000
        );
        setListReport(listReport.filter((item) => item._id != currentId));
      }
    });
  };
  const Refuse = async () => {
    await APIDeleteReport(currentId).then((res) => {
      console.log(res);
      if (res.status == 200 || res.status == 201) {
        setIsShow(false);
        Toast(
          "success",
          typeMes == "ok"
            ? "Thao tác ĐỒNG Ý thành công"
            : "Thao tác TỪ CHỐI thành công",
          2000
        );
        setListReport(listReport.filter((item) => item._id != currentId));
      }
    });
  };
  return (
    <>
      <SortTable
        title={arrTitle}
        totalPage={total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={10}
      >
        {listReport?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              {(page - 1) * 10 + index + 1}
            </td>
            <td className="px-6 py-4 text-center">{item.userName}</td>
            <td className="px-6 py-4 text-center">{item.name}</td>
            <td className="px-6 py-4 text-center">{item.content}</td>
            <td className="px-6 py-4 text-center">
              {ConvertDate(item.createdAt)}
            </td>
            <td>
              {!status && (
                <div
                  className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer m-1"
                  onClick={(e) => {
                    setTypeMes("ok");
                    setIsShow(true);
                    setCurrentId(item._id);
                  }}
                >
                  Đồng ý
                </div>
              )}
              <div
                className="px-6 text-center font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer m-1"
                onClick={(e) => {
                  setTypeMes("refuse");
                  setIsShow(true);
                  setCurrentId(item._id);
                }}
              >
                {status ? "Xoá" : "Từ chối"}{" "}
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
      <Modal
        isShow={isShow}
        setIsShow={(data: any) => setIsShow(data)}
        confirm={() => {
          typeOb[typeMes]?.func();
        }}
        title="Thông báo xác nhận"
      >
        <div className="font-bold text-lg text-center">
          {typeOb[typeMes]?.mes}
        </div>
      </Modal>
    </>
  );
}

export default Report;
