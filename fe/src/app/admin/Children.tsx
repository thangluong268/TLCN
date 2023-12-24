"use client";
import React from "react";
import { CATEGORYADMIN } from "@/constants/CategoryAdmin";
interface ChildrenProps {
  role: string;
}

interface DataAdmin {
  title: string;
  value: string;
  element: any;
}

function Children(props: ChildrenProps) {
  const { role } = props;
  const [category, setCategory] = React.useState<DataAdmin[]>();
  const [dataAdmin, setDataAdmin] = React.useState<any>({
    title: "",
    value: "",
    element: () => <></>,
  });
  React.useEffect(() => {
    if (role == "Manager_User") {
      setCategory(CATEGORYADMIN.filter((item) => item.value == "user"));
    } else if (role == "Manager_Store") {
      setCategory(CATEGORYADMIN.filter((item) => item.value == "store"));
    } else if (role == "Manager_Product") {
      setCategory(CATEGORYADMIN.filter((item) => item.value == "product"));
    } else {
      setCategory(CATEGORYADMIN);
    }
  }, [role]);

  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <div className="flex flex-col bg-white rounded-md p-2 mb-5 col-span-2">
        {category?.map((item: { value: string; title: string }, index) => (
          <div
            key={index}
            className={`${
              dataAdmin.value === item.value
                ? "bg-blue-300 font-bold text-white"
                : "bg-blue-100"
            } cursor-pointer hover:bg-blue-300 transition-all rounded-sm py-3 px-2 mb-2`}
            onClick={(e) => setDataAdmin(item)}
          >
            {item.title}
          </div>
        ))}
        <div
          className="bg-red-500 cursor-pointer hover:bg-red-400 transition-all rounded-sm py-3 px-2 mb-2 text-white"
          onClick={(e) => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Đăng xuất
        </div>
      </div>
      <div className=" col-span-8 ">
        <dataAdmin.element />
      </div>
    </div>
  );
}

export default Children;
