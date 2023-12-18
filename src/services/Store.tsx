import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

export const APIUploadImage = async (file: any) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    file
  );
  return res.data;
};

export const APICreate = async (body: any) => {
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

export const APIGetMyStore = async () => {
  document.getElementById("loading-page")?.classList.remove("hidden");
  const headers = GetHeaders();
  console.log(headers);
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store/seller`,
    { headers }
  );
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};

// api/store/seller => PUT
export const APIUpdateMyStore = async (body: any) => {
  const headers = GetHeaders();
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/store/seller`,
    body,
    { headers }
  );
  return res.data;
};

// /api/store-reputation?storeId=654736b154e5a9481f44b86d
export const APIGetStoreReputation = async (storeId: string) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store-reputation?storeId=${storeId}`,
    { headers }
  );
  return res.data;
};

// /api/store/123
export const APIGetStoreById = async (id: string) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store/${id}`,
    { headers }
  );
  return res.data;
};

// api/store/admin/stores-most-products?limit=10
export const APIGetStoreMostProduct = async (limit: number) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/store/admin/stores-most-products?limit=${limit}`,
    { headers }
  );
  return res.data;
};
