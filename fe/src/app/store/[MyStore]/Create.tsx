import React from "react";
import UploadFile from "./UploadFile";
import Input from "@/components/Input";
import { CREATEPRODUCT } from "@/constants/CreateProduct";
import CheckValidInput from "@/utils/CheckValidInput";

function Create() {
  const [product, setProduct] = React.useState({
    name: "",
    price: 0,
    img: [],
    description: "",
  });
  return (
    <div className="bg-white rounded-md p-4 mb-5">
      <div className="flex justify-between items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <UploadFile index={index} />
        ))}
      </div>
      <div>
        {CREATEPRODUCT.map((item, index) => (
          <Input label={item.label} required={true} key={index}>
            <input
              id={`formCreate-${item.name}`}
              type="text"
              className="w-full outline-none border-solid border-2 border-gray-300 rounded-md p-2"
              placeholder={item.placeholder}
              name={item.name}
              // disabled={item.name === "phoneNumber1" ? true : false}
              // value={store[item.name as keyof typeof store]}
              // onChange={(e) =>
              //   setStore({ ...store, [item.name]: e.target.value })
              // }
              onBlur={(e) => {
                const result = CheckValidInput({
                  [`${item.identify}`]: e.target.value,
                });
                if (result !== "") {
                  document
                    .getElementById(`formCreate-${item.name}`)
                    ?.classList.add("border-red-500");
                } else {
                  document
                    .getElementById(`formCreate-${item.name}`)
                    ?.classList.remove("border-red-500");
                }
                document.getElementById(`errMes-${item.name}`)!.innerHTML =
                  result;
              }}
            />
            <span
              id={`errMes-${item.name}`}
              className="text-red-500 text-sm"
            ></span>
          </Input>
        ))}
      </div>
    </div>
  );
}

export default Create;
