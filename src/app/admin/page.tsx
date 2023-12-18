"use client";
import React from "react";
import { CATEGORYADMIN } from "@/constants/CategoryAdmin";
import { setCategoryAdmin } from "@/redux/features/categoryAdmin/categoryAdmin-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

function MyStore() {
  const dispatch = useDispatch<AppDispatch>();
  const dataAdmin = useAppSelector((state) => state.categoryAdminReducer.items);

  return (
    <div className="min-h-screen px-[10px] my-2 grid grid-cols-10 gap-4">
      <div className="flex flex-col bg-white rounded-md p-2 mb-5 col-span-2">
        {CATEGORYADMIN.map((item: { value: string; title: string }, index) => (
          <div
            key={index}
            className={`${
              dataAdmin.value === item.value
                ? "bg-blue-300 font-bold text-white"
                : "bg-blue-100"
            } cursor-pointer hover:bg-blue-300 transition-all rounded-sm py-3 px-2 mb-2`}
            onClick={(e) => dispatch(setCategoryAdmin(item))}
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
        {dataAdmin.value === "home" ? (
          <dataAdmin.element
            setActive={(data: string) => {
              const selectedCategory = CATEGORYADMIN.find(
                (item) => item.value === data
              );
              if (selectedCategory) {
                dispatch(setCategoryAdmin(selectedCategory));
              }
            }}
          />
        ) : (
          <dataAdmin.element />
        )}
      </div>
    </div>
  );
}

export default MyStore;
