"use client";
import { CATEGORYSTORE } from "@/constants/CategoryStore";
import React from "react";

function MyStore() {
  const [isActive, setIsActive] = React.useState<any>(CATEGORYSTORE[0]);
  return (
    <div className="min-h-screen px-[150px] my-4 grid grid-cols-10 gap-4">
      <div className="flex flex-col bg-white rounded-md p-2 mb-5 col-span-2">
        {CATEGORYSTORE.map((item: { value: string; title: string }) => (
          <div
            className={`${
              isActive.value === item.value
                ? "bg-blue-300 font-bold text-white"
                : "bg-blue-100"
            } cursor-pointer hover:bg-blue-300 transition-all rounded-sm py-3 px-2 mb-2`}
            onClick={(e) => setIsActive(item)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className=" col-span-8 overflow-scroll scrollbar-hide max-h-screen">
        {isActive.value === "home" ? (
          <isActive.element
            setActive={(data: string) => {
              const selectedCategory = CATEGORYSTORE.find(
                (item) => item.value === data
              );
              if (selectedCategory) {
                setIsActive(selectedCategory);
              }
            }}
          />
        ) : (
          <isActive.element />
        )}
      </div>
    </div>
  );
}

export default MyStore;
