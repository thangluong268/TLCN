import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  ArcElement,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  ArcElement
);

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface HomeProps {
  setActive: any;
}

function Home(props: HomeProps) {
  const { setActive } = props;
  const dataSell: ChartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        data: [100, 120, 115, 134, 168, 132, 200, 115, 134, 168, 132, 200],
        backgroundColor: "blue",
        borderColor: "#bfbfbf",
      },
    ],
  };

  const optionsSell: any = {
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ doanh thu năm",
        color: "#007aff",
        font: {
          size: 24,
        },
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        type: "category",
        labels: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      y: {
        beginAtZero: true, // Example configuration for the y-axis
      },
    },
    type: "line",
  };

  const dataCharity: ChartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        data: [100, 120, 115, 134, 168, 132, 200, 115, 134, 168, 132, 200],
        backgroundColor: "blue",
        borderColor: "#bfbfbf",
      },
    ],
  };

  const optionsCharity: any = {
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ từ thiện năm",
        color: "#007aff",
        font: {
          size: 24,
        },
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        type: "category",
        labels: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      y: {
        beginAtZero: true, // Example configuration for the y-axis
      },
    },
    type: "line",
  };

  const dataBill: any = {
    labels: ["Đã hoàn", "Đã huỷ", "Đã bán", "Đã tặng"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        hoverOffset: 30,
        borderWidth: 1,
      },
    ],
  };

  //Tạo options cho pie chart (biểu đồ tròn), kích thước nhỏ
  const optionsBill: any = {
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ đơn hàng năm",
        color: "#007aff",
        font: {
          size: 24,
        },
      },
      legend: {
        display: true,
        position: "right",
      },
    },
    layout: {
      padding: {
        bottom: 20,
      },
    },
  };

  return (
    <div>
      <div className="bg-white rounded-md p-4 mb-5">
        <div className="text-center text-blue-500 font-bold text-2xl mb-2">
          Trạng thái cửa hàng
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div
            className="col-span-1 text-center rounded-md bg-blue-300 p-4 hover:bg-blue-400 cursor-pointer"
            onClick={(e) => setActive("new")}
          >
            <span className="text-lg font-bold">Đơn mới</span>: 8
          </div>
          <div
            className="col-span-1 text-center rounded-md bg-blue-300 p-4 hover:bg-blue-400 cursor-pointer"
            onClick={(e) => setActive("preparing")}
          >
            <span className="text-lg font-bold">Đơn đang chuẩn bị</span>: 8
          </div>
          <div
            className="col-span-1 text-center rounded-md bg-blue-300 p-4 hover:bg-blue-400 cursor-pointer"
            onClick={(e) => setActive("shipping")}
          >
            <span className="text-lg font-bold">Đơn đang giao</span>: 8
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 mb-5">
        {/* For sell */}
        <Line data={dataSell} options={optionsSell} />
        <div className="grid gap-2 grid-cols-2 mb-10 rounded-md border-2 p-2 border-red-400">
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng doanh thu: 2000000
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng doanh thu của năm: 2000000
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Doanh thu cao nhất: 2000000
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Doanh thu thấp nhất: 2000000
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 mb-5">
        {/* For charity */}
        <Line data={dataCharity} options={optionsCharity} />
        <div className="grid gap-2 grid-cols-2 mb-10 rounded-md border-2 p-2 border-red-400">
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng sản phẩm đã tặng: 2000000
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng sản phẩm đã tặng của năm: 2000000
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Số lượng sản phẩm tặng nhiều nhất: 2000000
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Số lượng sản phẩm tặng ít nhất: 2000000
          </div>
        </div>
      </div>

      {/* For bill */}
      <div className="bg-white rounded-md p-4 mb-5">
        <div className="max-w-[50%] mx-auto flex justify-center ">
          <Pie data={dataBill} options={optionsBill} />
        </div>
      </div>
    </div>
  );
}

export default Home;
