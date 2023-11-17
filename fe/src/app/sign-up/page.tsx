"use client";
import React from "react";
import FrameFormInit from "@/components/FrameFormInit";
import Input from "@/components/Input";
import { SIGNUP } from "@/constants/Signup";
import CheckValidInput from "@/utils/CheckValidInput";
import { APIVerifyOTP, APISendOTP } from "@/services/UserOTP";
import FrameInit from "@/components/FrameInit";
import { FaLongArrowAltLeft, FaRedo } from "react-icons/fa";
import { APISignUp } from "@/services/Auth";
import Toast from "@/utils/Toast";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  repassword: string;
}
function SignUp() {
  const [signUpForm, setSignUpForm] = React.useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [checkState, setCheckState] = React.useState({
    isSendOTP: false,
    titleButton: "Đăng ký",
    navigateTitle: "Đã có tài khoản?",
  });

  React.useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        checkState.isSendOTP ? ConfirmOTP() : SendOTP();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [[signUpForm], [checkState]]);

  const SendOTP = async () => {
    if (
      document
        .getElementById("formSignup-name")
        ?.classList.contains("border-red-500") ||
      document
        .getElementById("formSignup-email")
        ?.classList.contains("border-red-500") ||
      document
        .getElementById("formSignup-password")
        ?.classList.contains("border-red-500") ||
      document
        .getElementById("formSignup-repassword")
        ?.classList.contains("border-red-500") ||
      signUpForm.name === "" ||
      signUpForm.email === "" ||
      signUpForm.password === "" ||
      signUpForm.repassword === ""
    ) {
      Toast("warning", "Vui lòng nhập đầy đủ thông tin", 5000);
    } else {
      const res = await APISendOTP(signUpForm.email);
      if (res.message) {
        Toast("error", res.message, 5000);
      } else {
        Toast("success", `Mã OTP đang được gửi đến ${signUpForm.email}`, 5000);
        setCheckState({
          ...checkState,
          isSendOTP: true,
          titleButton: "Xác nhận",
          navigateTitle: "Nhập lại thông tin",
        });
      }
    }
  };

  const ReSendOTP = async () => {
    const res = await APISendOTP(signUpForm.email);
    if (res.message) {
      Toast("error", res.message, 5000);
    } else {
      Toast("success", `Mã OTP đang được gửi đến ${signUpForm.email}`, 5000);
    }
  };

  const [otp, setOtp] = React.useState("");
  const ConfirmOTP = async () => {
    if (
      document
        .getElementById("formSignup-otp")
        ?.classList.contains("border-red-500") ||
      otp === ""
    ) {
      Toast("warning", "Thông tin chưa chính xác", 5000);
    } else {
      const result = await APIVerifyOTP(signUpForm.email, otp);
      if (result.message) {
        Toast("error", result.message, 5000);
      } else {
        Toast("success", "Đăng ký thành công", 2000);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        const result = await APISignUp(signUpForm);
      }
    }
  };

  return (
    <div>
      <FrameInit />
      <div className="absolute top-0 left-[5%] z-20">
        <div className="flex flex-col items-center justify-center h-screen">
          <FrameFormInit
            title={`${checkState.isSendOTP ? "NHẬP MÃ OTP" : "ĐĂNG KÝ"}`}
          >
            {checkState.isSendOTP ? (
              <>
                <div className="w-full">
                  <Input label="Mã OTP">
                    <input
                      placeholder="Nhập mã OTP"
                      className="placeholder-white outline-none py-3 bg-gray-400 text-white rounded-[10px] w-full px-4 border-solid border-2 "
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      id="formSignup-otp"
                      onBlur={(e) => {
                        const result = CheckValidInput({ otp: e.target.value });
                        if (result !== "") {
                          document
                            .getElementById(`formSignup-otp`)!
                            .classList.add("border-red-500");
                        } else {
                          document
                            .getElementById(`formSignup-otp`)!
                            .classList.remove("border-red-500");
                        }
                        document.getElementById(`errMes-otp`)!.innerHTML =
                          result;
                      }}
                    />
                    <span
                      id={`errMes-otp`}
                      className="text-red-500 text-sm"
                    ></span>
                  </Input>
                </div>
              </>
            ) : (
              <>
                {SIGNUP.map((item) => (
                  <div key={item.name} className="w-full">
                    <Input label={item.label}>
                      <input
                        id={`formSignup-${item.name}`}
                        value={signUpForm[item.name as keyof SignUpForm]}
                        onChange={(e) =>
                          setSignUpForm({
                            ...signUpForm,
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
                                  password: signUpForm.password,
                                }
                              : {
                                  [`${item.name}`]: e.target.value,
                                }
                          );
                          if (result !== "") {
                            document
                              .getElementById(`formSignup-${item.name}`)
                              ?.classList.add("border-red-500");
                          } else {
                            document
                              .getElementById(`formSignup-${item.name}`)
                              ?.classList.remove("border-red-500");
                          }
                          document.getElementById(
                            `errMes-${item.name}`
                          )!.innerHTML = result;
                        }}
                        placeholder={item.placeholder}
                        className="placeholder-white outline-none py-3 bg-gray-400 text-white rounded-[10px] w-full px-4 border-solid border-2 "
                      />
                      <span
                        id={`errMes-${item.name}`}
                        className="text-red-500 text-sm"
                      ></span>
                    </Input>
                  </div>
                ))}
              </>
            )}
            <div className="w-full mt-2 flex justify-end">
              <div className="font-bold cursor-pointer">
                <div
                  className="flex items-center"
                  onClick={(e) => {
                    checkState.isSendOTP
                      ? setCheckState({
                          ...checkState,
                          isSendOTP: false,
                          titleButton: "Đăng ký",
                          navigateTitle: "Đã có tài khoản?",
                        })
                      : (window.location.href = "/login");
                  }}
                >
                  <div className="mr-2">
                    <FaLongArrowAltLeft></FaLongArrowAltLeft>
                  </div>
                  {checkState.navigateTitle}
                </div>
                {checkState.isSendOTP && (
                  <div
                    className="flex items-center"
                    onClick={(e) => ReSendOTP()}
                  >
                    <div className="mr-2">
                      <FaRedo></FaRedo>
                    </div>
                    Gửi lại mã OTP
                  </div>
                )}
              </div>
            </div>
            <div className="w-full mt-4">
              <button
                className="py-3 bg-gray-600 text-white rounded-[10px] w-full px-4 font-bold text-lg"
                onClick={(e) => {
                  checkState.isSendOTP ? ConfirmOTP() : SendOTP();
                }}
              >
                {checkState.titleButton}
              </button>
            </div>
          </FrameFormInit>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
