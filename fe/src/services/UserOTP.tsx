import axios from "axios";

export const APISendOTP = async (email: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/userotp/user/sendotp`,
    {
      email,
    }
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};

export const APIVerifyOTP = async (email: string, otp: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/userotp/user/checkotp`,
    {
      email,
      otp,
    }
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};

export const APISendOTPForget = async (email: string) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/userotp/user/sendotp-forget`,
    {
      email,
    }
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};
