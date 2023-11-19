import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

export const UploadImage = async (file: any) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    file
  );
  return res.data;
};

export const Create = async (body: any) => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const headers = GetHeaders();
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/store/user`,
    body,
    { headers }
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};

export const GetMyStore = async () => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store/seller`,
    { headers }
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};
