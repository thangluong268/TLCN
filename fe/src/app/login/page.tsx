"use client";
import React from "react";
import FrameFormInit from "@/components/FrameFormInit";
import Input from "./input";
import CheckValidInput from "@/utils/CheckValidInput";
import FrameInit from "@/components/FrameInit";
import { FaFacebook, FaLongArrowAltLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LOGIN } from "@/constants/Login";
import Link from "next/link";
import Toast from "@/utils/Toast";
import { APILogin } from "@/services/Auth";
import { UserAuth } from "../authContext";

interface LoginForm {
  email: string;
  password: string;
}
function Login() {
  const [loginForm, setLoginForm] = React.useState<LoginForm>({
    email: "",
    password: "",
  });
  const { user, googleSignIn, facebookSignIn, logOut } = UserAuth();

  React.useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void }) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        Login();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [loginForm]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleSignIn = async (func: () => void) => {
    try {
      await func();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const Login = async () => {
    if (
      document
        .getElementById("formLogin-email")
        ?.classList.contains("border-red-500") ||
      document
        .getElementById("formLogin-password")
        ?.classList.contains("border-red-500") ||
      loginForm.email === "" ||
      loginForm.password === ""
    ) {
      Toast("warning", "Vui lòng nhập đầy đủ thông tin", 5000);
    } else {
      const res = await APILogin(loginForm.email, loginForm.password);
      if (res.accessToken && res.refreshToken) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        Toast("success", "Đăng nhập thành công", 2000);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        Toast("error", "Tài khoản hoặc mật khẩu không đúng", 5000);
      }
    }
  };

  return (
    <div>
      <FrameInit />
      <div className="absolute top-0 left-[5%]">
        <div className="flex flex-col items-center justify-center h-screen">
          <FrameFormInit title="ĐĂNG NHẬP">
            {LOGIN.map((item) => (
              <div key={item.name} className="w-full">
                <Input label={item.label}>
                  <input
                    id={`formLogin-${item.name}`}
                    value={loginForm[item.name as keyof LoginForm]}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        [item.name]: e.target.value,
                      })
                    }
                    name={item.name}
                    type={item.name === "password" ? "password" : "text"}
                    onBlur={(e) => {
                      const result = CheckValidInput({
                        [`${item.name == "password" ? "name" : item.name}`]:
                          e.target.value,
                      });
                      if (result !== "") {
                        document
                          .getElementById(`formLogin-${item.name}`)
                          ?.classList.add("border-red-500");
                      } else {
                        document
                          .getElementById(`formLogin-${item.name}`)
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
            <div className="w-full mt-2 flex justify-between">
              <Link
                href="/forget-password"
                className="font-bold cursor-pointer"
              >
                Quên mật khẩu
              </Link>
              <Link href="/sign-up" className="font-bold cursor-pointer">
                <div className="flex items-center">
                  <div className="mr-2">
                    <FaLongArrowAltLeft></FaLongArrowAltLeft>
                  </div>
                  Chưa có tài khoản?
                </div>
              </Link>
            </div>
            <div className="w-full mt-4">
              <button
                className="py-3 bg-gray-600 text-white rounded-[10px] mt-2 w-full px-4 font-bold text-lg"
                onClick={(e) => Login()}
              >
                Đăng nhập
              </button>
              <div className="flex justify-between items-center">
                <div
                  className="py-3 bg-red-600 rounded-[10px] mt-2 w-[49%] px-4 font-bold text-lg"
                  onClick={(e) => handleSignIn(googleSignIn)}
                >
                  <div className="flex cursor-pointer text-white items-center justify-center rounded-md">
                    <FcGoogle fontSize={30} className="r1-2 mr-2" />
                    <span>Log in with Google</span>
                  </div>
                </div>
                <div
                  className="py-3 bg-blue-600 rounded-[10px] mt-2 w-[49%] px-4 font-bold text-lg"
                  onClick={(e) => handleSignIn(facebookSignIn)}
                >
                  <div className="flex cursor-pointer text-white items-center justify-center rounded-md">
                    <FaFacebook fontSize={30} className="r1-2 mr-2" />
                    <span>Log in with Facebook</span>
                  </div>
                </div>
              </div>
            </div>
          </FrameFormInit>
        </div>
      </div>
    </div>
  );
}

export default Login;
