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
import {
  APIGetCharityByYear,
  APIGetCountBillAdmin,
  APIGetCountBillByStatus,
  APIGetRevenueByYear,
} from "@/services/Bill";
import FormatMoney from "@/utils/FormatMoney";
import { FaBoxOpen, FaKaaba, FaStore, FaUser } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import FormatDecimal from "@/utils/FormatDecimal";

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
  maxRevenue: {
    month: string;
    revenue: number;
  };
  minRevenue: {
    month: string;
    revenue: number;
  };
  revenueTotalAllTime: number;
  revenueTotalInYear: number;
}

interface ChartCharityData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
  maxGive: {
    month: string;
    numOfGive: number;
  };
  minGive: {
    month: string;
    numOfGive: number;
  };
  charityTotalAllTime: number;
  charityTotalInYear: number;
}

interface ChartBillData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    hoverOffset: number;
    borderWidth: number;
  }[];
}

interface HomeProps {
  setActive?: any;
}

function Home(props: HomeProps) {
  const { setActive } = props;
  // useStates for dataSell, dataCharity, dataBill
  const [dataSellState, setDataSellState] = React.useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: "blue",
        borderColor: "#bfbfbf",
      },
    ],
    maxRevenue: {
      month: "",
      revenue: 0,
    },
    minRevenue: {
      month: "",
      revenue: 0,
    },
    revenueTotalAllTime: 0,
    revenueTotalInYear: 0,
  });
  const [dataCharityState, setDataCharityState] =
    React.useState<ChartCharityData>({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: "blue",
          borderColor: "#bfbfbf",
        },
      ],
      maxGive: {
        month: "",
        numOfGive: 0,
      },
      minGive: {
        month: "",
        numOfGive: 0,
      },
      charityTotalAllTime: 0,
      charityTotalInYear: 0,
    });
  const [dataBillState, setDataBillState] = React.useState<ChartBillData>({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [],
        borderColor: [],
        hoverOffset: 0,
        borderWidth: 0,
      },
    ],
  });

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

  const [dataState, setDataState] = React.useState<any>({
    NEW: 0,
    CONFIRMED: 0,
    DELIVERING: 0,
  });

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await APIGetCountBillByStatus().then((res) => res);
  //     setDataState({
  //       NEW: data.metadata.data.NEW,
  //       CONFIRMED: data.metadata.data.CONFIRMED,
  //       DELIVERING: data.metadata.data.DELIVERING,
  //     });
  //   };
  //   fetchData();
  // }, []);

  // APIGetRevenueByYear
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await APIGetRevenueByYear(
  //       new Date().getFullYear() + ""
  //     ).then((res) => res);
  //     // Set data for dataSellState
  //     console.log(data);
  //     const labels = Object.keys(data.metadata.data.data);
  //     const value = Object.values(data.metadata.data.data);

  //     const outputData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           data: value,
  //           backgroundColor: "blue",
  //           borderColor: "#bfbfbf",
  //         },
  //       ],
  //       maxRevenue: data.metadata.data.maxRevenue || 0,
  //       minRevenue: data.metadata.data.minRevenue || 0,
  //       revenueTotalAllTime: data.metadata.data.revenueTotalAllTime,
  //       revenueTotalInYear: data.metadata.data.revenueTotalInYear,
  //     };
  //     setDataSellState(outputData as ChartData);
  //   };
  //   fetchData();
  // }, []);

  // APIGetCharityByYear
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await APIGetCharityByYear(
  //       new Date().getFullYear() + ""
  //     ).then((res) => res);
  //     // Set data for dataSellState
  //     const labels = Object.keys(data.metadata.data.data);
  //     const value = Object.values(data.metadata.data.data);

  //     const outputData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           data: value,
  //           backgroundColor: "blue",
  //           borderColor: "#bfbfbf",
  //         },
  //       ],
  //       maxGive: data.metadata.data.maxGive,
  //       minGive: data.metadata.data.minGive,
  //       charityTotalAllTime: data.metadata.data.charityTotalAllTime,
  //       charityTotalInYear: data.metadata.data.charityTotalInYear,
  //     };
  //     setDataCharityState(outputData as ChartCharityData);
  //   };
  //   fetchData();
  // }, []);

  // APIGetCountBillByYear
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await APIGetCountBillByStatus(
  //       new Date().getFullYear() + ""
  //     ).then((res) => res);
  //     const labels = Object.keys(data.metadata.data);
  //     const value = Object.values(data.metadata.data);
  //     // Đổi tên cho label forEach
  //     labels.forEach((item, index) => {
  //       if (item === "CONFIRMED") {
  //         labels[index] = "ĐANG CHUẨN BỊ";
  //       } else if (item === "DELIVERING") {
  //         labels[index] = "ĐNAG GIAO";
  //       } else if (item === "NEW") {
  //         labels[index] = "ĐƠN MỚI";
  //       } else if (item === "CANCELLED") {
  //         labels[index] = "ĐÃ HUỶ";
  //       } else if (item === "RETURNED") {
  //         labels[index] = "ĐÃ HOÀN";
  //       } else if (item === "DELIVERED") {
  //         labels[index] = "ĐÃ GIAO";
  //       }
  //     });

  //     const outputData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: "",
  //           data: value,
  //           backgroundColor: [
  //             "rgba(255, 99, 132, 0.2)",
  //             "rgba(54, 162, 235, 0.2)",
  //             "#FFCE56",
  //             "#36A2EB",
  //           ],
  //           borderColor: [
  //             "rgba(255, 99, 132, 1)",
  //             "rgba(54, 162, 235, 1)",
  //             "#FFCE56",
  //             "#36A2EB",
  //           ],
  //           hoverOffset: 30,
  //           borderWidth: 1,
  //         },
  //       ],
  //     };
  //     setDataBillState(outputData as ChartBillData);
  //   };
  //   fetchData();
  // }, []);
  const [dataTotal, setDataTotal] = React.useState<any>({
    totalProduct: 0,
    totalRevenue: 0,
    totalStore: 0,
    totalUser: 0,
  });
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await APIGetCountBillAdmin().then((res) => res);
      setDataTotal({
        totalProduct: data.metadata.data.totalProduct,
        totalRevenue: data.metadata.data.totalRevenue,
        totalStore: data.metadata.data.totalStore,
        totalUser: data.metadata.data.totalUser,
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <FaBoxOpen className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalProduct)}
          </div>
          <div className="text-center text-gray-400">Tổng sản phẩm</div>
        </div>
        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <FaStore className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalStore)}
          </div>
          <div className="text-center text-gray-400">Tổng cửa hàng</div>
        </div>
        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <FaUser className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalUser)}
          </div>
          <div className="text-center text-gray-400">Tổng người dùng</div>
        </div>

        <div className="rounded-lg bg-white py-6 px-7.5 shadow-lg px-3">
          <div className="p-3 rounded-full bg-gray-400 bg-opacity-50 w-fit mb-3 mx-auto">
            <MdAttachMoney className="text-5xl text-[#3c50e0]" />
          </div>
          <div className="text-center font-bold text-3xl">
            {FormatDecimal(dataTotal.totalRevenue)}
          </div>
          <div className="text-center text-gray-400">Tổng doanh thu (VNĐ)</div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 mb-5">
        {/* For sell */}
        <Line data={dataSellState} options={optionsSell} />
        <div className="grid gap-2 grid-cols-2 mb-10 rounded-md border-2 p-2 border-red-400">
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng doanh thu: {FormatMoney(dataSellState.revenueTotalAllTime)}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng doanh thu của năm:{" "}
            {FormatMoney(dataSellState.revenueTotalInYear)}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Doanh thu cao nhất: {FormatMoney(dataSellState.maxRevenue.revenue)}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Doanh thu thấp nhất: {FormatMoney(dataSellState.minRevenue.revenue)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 mb-5">
        {/* For charity */}
        <Line data={dataCharityState} options={optionsCharity} />
        <div className="grid gap-2 grid-cols-2 mb-10 rounded-md border-2 p-2 border-red-400">
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng sản phẩm đã tặng: {dataCharityState.charityTotalAllTime}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Tổng sản phẩm đã tặng của năm: {dataCharityState.charityTotalInYear}
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Số lượng sản phẩm tặng nhiều nhất:{" "}
            {dataCharityState.maxGive?.numOfGive} (
            {dataCharityState.maxGive?.month})
          </div>
          <div className="font-bold text-red-500 text-center col-span-1">
            Số lượng sản phẩm tặng ít nhất:{" "}
            {dataCharityState.minGive?.numOfGive} (
            {dataCharityState.minGive?.month})
          </div>
        </div>
      </div>

      {/* For bill */}
      <div className="bg-white rounded-md p-4 mb-5">
        <div className="max-w-[50%] mx-auto flex justify-center ">
          <Pie data={dataBillState} options={optionsBill} />
        </div>
      </div>
    </div>
  );
}

export default Home;
