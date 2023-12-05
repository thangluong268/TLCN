import SortTable from "@/components/SortTable";
import React from "react";

function Warehouse() {
  const arrTitle = [
    {
      name: "Tên sản phẩm",
      sort: true,
    },
    {
      name: "Loại sản phẩm",
      sort: false,
    },
    {
      name: "Giá",
      sort: false,
    },
    {
      name: "Số lượng còn lại",
      sort: true,
    },
    {
      name: "Số lượng đã bán",
      sort: false,
    },
    {
      name: "Số lượng đã tặng",
      sort: false,
    },
    {
      name: "Doanh số",
      sort: true,
    },
    {
      name: "Thao tác",
      sort: false,
    },
  ];
  return (
    <SortTable title={arrTitle}>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          Apple MacBook Pro 17"
        </th>
        <td className="px-6 py-4">Silver</td>
        <td className="px-6 py-4">Laptop</td>
        <td className="px-6 py-4">$2999</td>
        <td className="px-6 py-4">$2999</td>
        <td className="px-6 py-4">$2999</td>
        <td className="px-6 py-4">$2999</td>
        <td className="px-6 py-4 text-left">
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </a>
        </td>
      </tr>
    </SortTable>
  );
}

export default Warehouse;
