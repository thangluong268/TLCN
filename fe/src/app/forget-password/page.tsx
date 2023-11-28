"use client";
import React from "react";
import FrameFormInit from "@/components/FrameFormInit";
import Input from "@/components/Input";
import CheckValidInput from "@/utils/CheckValidInput";
import FrameInit from "@/components/FrameInit";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { LOGIN } from "@/constants/Login";
import Link from "next/link";
import Toast from "@/utils/Toast";
import { APIForgetPassword, APILogin } from "@/services/Auth";
import { FORGETPASSWORD } from "@/constants/ForgetPassword";
import { APISendOTP, APISendOTPForget, APIVerifyOTP } from "@/services/UserOTP";
interface ForgetPasswordForm {
  email: string;
  otp: string;
  password: string;
  repassword: string;
}

function ForgetPassword() {
  const [forgetForm, setLoginForm] = React.useState<ForgetPasswordForm>({
    email: "",
    otp: "",
    password: "",
    repassword: "",
  });
  const [listField, setListField] = React.useState(
    FORGETPASSWORD.filter(
      (item) =>
        item.name !== "otp" &&
        item.name !== "password" &&
        item.name !== "repassword"
    )
  );
  const [checkState, setCheckState] = React.useState("UnSend");
  React.useEffect(() => {
    if (checkState == "UnSend") {
      forgetForm.email = "";
      setListField(
        FORGETPASSWORD.filter(
          (item) =>
            item.name !== "otp" &&
            item.name !== "password" &&
            item.name !== "repassword"
        )
      );
    } else if (checkState == "Sent") {
      forgetForm.otp = "";
      setListField(
        FORGETPASSWORD.filter(
          (item) =>
            item.name !== "email" &&
            item.name !== "password" &&
            item.name !== "repassword"
        )
      );
    } else if (checkState == "Confirm") {
      forgetForm.password = "";
      forgetForm.repassword = "";
      setListField(
        FORGETPASSWORD.filter(
          (item) => item.name !== "email" && item.name !== "otp"
        )
      );
    }
  }, [checkState]);
  React.useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        Confirm();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [forgetForm]);
  const Confirm = async () => {
    if (checkState == "UnSend") {
      if (
        document
          .getElementById("formForgetPassword-email")
          ?.classList.contains("border-red-500") ||
        forgetForm.email === ""
      ) {
        Toast("warning", "Vui lòng nhập đầy đủ thông tin", 5000);
        return;
      }
      const res = await APISendOTPForget(forgetForm.email);
      if (res.status != 200 && res.status != 201) {
        Toast("error", res.message, 5000);
        return;
      }
      Toast("success", `Mã OTP đang được gửi đến ${forgetForm.email}`, 5000);
      setCheckState("Sent");
    } else if (checkState == "Sent") {
      if (
        document
          .getElementById("formForgetPassword-otp")
          ?.classList.contains("border-red-500") ||
        forgetForm.otp === ""
      ) {
        Toast("warning", "Vui lòng nhập đầy đủ thông tin", 5000);
        return;
      }
      const res = await APIVerifyOTP(forgetForm.email, forgetForm.otp);
      if (res.status != 200 && res.status != 201) {
        Toast("error", res.message, 5000);
        return;
      }
      Toast("success", "Chuẩn rồi, nhập mật khẩu mới nhé", 2000);
      setCheckState("Confirm");
    } else {
      if (
        document
          .getElementById("formForgetPassword-password")
          ?.classList.contains("border-red-500") ||
        document
          .getElementById("formForgetPassword-repassword")
          ?.classList.contains("border-red-500") ||
        forgetForm.password === "" ||
        forgetForm.repassword === ""
      ) {
        Toast("warning", "Vui lòng nhập chính xác thông tin", 5000);
        return;
      }
      const result = await APIForgetPassword(
        forgetForm.email,
        forgetForm.password
      );
      if (result.status != 200 && result.status != 201) {
        Toast("error", result.message, 5000);
        return;
      }
      Toast("success", "Cập nhật thành công", 2000);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };
  return (
    <div>
      <FrameInit />
      <div className="absolute top-0 left-[5%] z-20">
        <div className="flex flex-col items-center justify-center h-screen">
          <FrameFormInit title="QUÊN MẬT KHẨU">
            {listField.map((item) => (
              <div key={item.name} className="w-full">
                <Input label={item.label}>
                  <input
                    id={`formForgetPassword-${item.name}`}
                    value={forgetForm[item.name as keyof ForgetPasswordForm]}
                    onChange={(e) =>
                      setLoginForm({
                        ...forgetForm,
                        [item.name]: e.target.value,
                      })
                    }
                    name={item.name}
                    type={
                      item.name === "password" || item.name == "repassword"
                        ? "password"
                        : "text"
                    }
                    onBlur={(e) => {
                      const result = CheckValidInput(
                        item.name == "repassword"
                          ? {
                              [`${item.name}`]: e.target.value,
                              password: forgetForm.password,
                            }
                          : {
                              [`${item.name}`]: e.target.value,
                            }
                      );
                      if (result !== "") {
                        document
                          .getElementById(`formForgetPassword-${item.name}`)
                          ?.classList.add("border-red-500");
                      } else {
                        document
                          .getElementById(`formForgetPassword-${item.name}`)
                          ?.classList.remove("border-red-500");
                      }
                      document.getElementById(
                        `errMes-${item.name}`
                      )!.innerHTML = result;
                    }}
                    placeholder={item.placeholder}
                    className="placeholder-white outline-none py-3 bg-gray-400 text-white rounded-[10px] mt-2 w-full px-4 border-solid border-2 "
                  />
                  <span
                    id={`errMes-${item.name}`}
                    className="text-red-500 text-sm"
                  ></span>
                </Input>
              </div>
            ))}
            {checkState != "UnSend" && (
              <div className="w-full mt-2 flex justify-end">
                <div
                  className="font-bold cursor-pointer"
                  onClick={(e) => setCheckState("UnSend")}
                >
                  <div className="flex items-center">
                    <div className="mr-2">
                      <FaLongArrowAltLeft></FaLongArrowAltLeft>
                    </div>
                    Nhập lại email
                  </div>
                </div>
              </div>
            )}

            <div className="w-full mt-4">
              <button
                className="py-3 bg-gray-600 text-white rounded-[10px] mt-2 w-full px-4 font-bold text-lg"
                onClick={(e) => Confirm()}
              >
                Xác nhận
              </button>
            </div>
          </FrameFormInit>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
