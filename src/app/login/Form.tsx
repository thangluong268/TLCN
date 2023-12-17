import React from "react";
import FrameFormInit from "@/components/FrameFormInit";
import Input from "@/components/Input";
import CheckValidInput from "@/utils/CheckValidInput";
import { FaFacebook, FaLongArrowAltLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LOGIN } from "@/constants/Login";
import Link from "next/link";
import { UserAuth } from "../authContext";
import Toast from "@/utils/Toast";
import { APILogin } from "@/services/Auth";
import axios from "axios";
interface LoginForm {
  email: string;
  password: string;
}

interface FormProps {
  fastLogin?: boolean;
}
function Form(props: FormProps) {
  const { fastLogin } = props;
  const [loginForm, setLoginForm] = React.useState<LoginForm>({
    email: "",
    password: "",
  });
  const { user, googleSignIn, facebookSignIn, logOut } = UserAuth();
  React.useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    }
  }, [user]);
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

  const handleSignIn = async (func: () => void) => {
    try {
      func();
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
      if (res.status !== 200 && res.status !== 201) {
        Toast("error", "Tài khoản hoặc mật khẩu không đúng", 5000);
        return;
      }
      console.log(res.metadata.data);
      localStorage.setItem("user", JSON.stringify(res.metadata.data));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.metadata.data.stsTokenManager.accessToken}`;
      Toast("success", "Đăng nhập thành công", 2000);
      setTimeout(() => {
        if (res.metadata.data.role == "Admin") window.location.href = "/admin";
        else {
          if (window.location.pathname === "/login") {
            window.location.href = "/";
          } else {
            window.location.reload();
          }
        }
      }, 2000);
    }
  };

  return (
    <FrameFormInit title="ĐĂNG NHẬP" fastLogin={fastLogin}>
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
                  [`${item.name}`]: e.target.value,
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
                document.getElementById(`errMes-${item.name}`)!.innerHTML =
                  result;
              }}
              placeholder={item.placeholder}
              className="placeholder-white outline-none py-3 bg-gray-400 text-white rounded-[10px] w-full px-4 border-solid border-2"
            />
            <span
              id={`errMes-${item.name}`}
              className="text-red-500 text-sm"
            ></span>
          </Input>
        </div>
      ))}
      <div className="w-full mt-2 flex justify-between">
        <Link href="/forget-password" className="font-bold cursor-pointer">
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

      <div className="w-full mt-2">
        <button
          className="py-3 bg-gray-600 text-white rounded-[10px] mb-2 w-full px-4 font-bold text-lg"
          onClick={(e) => Login()}
        >
          Đăng nhập
        </button>
        <div className="flex justify-between items-center mb-2">
          <div
            className="py-3 bg-red-600 rounded-[10px] w-[49%] px-4 font-bold text-lg"
            onClick={(e) => handleSignIn(googleSignIn)}
          >
            <div className="flex cursor-pointer text-white items-center justify-center rounded-md">
              <FcGoogle fontSize={30} className="r1-2 mr-2" />
              <span>Log in with Google</span>
            </div>
          </div>
          <div
            className="py-3 bg-blue-600 rounded-[10px] w-[49%] px-4 font-bold text-lg"
            onClick={(e) => handleSignIn(facebookSignIn)}
          >
            <div className="flex cursor-pointer text-white items-center justify-center rounded-md">
              <FaFacebook fontSize={30} className="r1-2 mr-2" />
              <span>Log in with Facebook</span>
            </div>
          </div>
        </div>
        <Link href="/" className=" font-bold cursor-pointer">
          <div className="flex items-center justify-center">
            <div className="mr-2">
              <FaLongArrowAltLeft></FaLongArrowAltLeft>
            </div>
            Trở về trang chủ
          </div>
        </Link>
      </div>
    </FrameFormInit>
  );
}

export default Form;
