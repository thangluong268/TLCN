import React from "react";

function CheckValidInput(obInput: any) {
  const arrInvalid = {
    blank: "Không được để trống",
    email: "Email không hợp lệ",
    password: "Mật khẩu không hợp lệ",
    strongPassword:
      "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
    repassword: "Mật khẩu không khớp",
    length6: "Mật khẩu phải có ít nhất 6 ký tự",
    otp: "Mã OTP không hợp lệ",
  };
  for (let key in obInput) {
    if (obInput[key].length === 0) {
      return arrInvalid.blank;
    }

    if (key === "password") {
      if (
        !obInput[key].match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/
        )
      ) {
        if (obInput[key].length < 6) {
          return arrInvalid.length6;
        } else {
          return arrInvalid.strongPassword;
        }
      }
    }

    if (key === "repassword") {
      if (obInput[key] !== obInput["password"]) {
        return arrInvalid.repassword;
      }
    }

    if (key === "email") {
      if (!obInput[key].match(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)) {
        return arrInvalid.email;
      }
    }

    if (key === "otp") {
      if (!obInput[key].match(/^[0-9]{6}$/)) {
        return arrInvalid.otp;
      }
    }
  }

  return "";
}

export default CheckValidInput;
