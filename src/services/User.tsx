import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

export const APIGetUserById = async (id: string) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/user/${id}`,
    { headers }
  );
  return res.data;
};

export const APIUpdateUser = async (id: string, body: any) => {
  const headers = GetHeaders();
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/user/${id}`,
    body,
    { headers }
  );
  return res.data;
};

// /api/user/admin?page=1&limit=1&search=2
export const APIGetListUser = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/admin?page=${page}&limit=${limit}&search=${search}`,
    { headers }
  );
  return res.data;
};

// /api/user/admin/get-all
export const APIGetAllUser = async () => {
  document.getElementById("loading-page")?.classList.remove("hidden");

  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/admin/get-all`,
    { headers }
  );
  document.getElementById("loading-page")?.classList.add("hidden");

  return res.data;
};

// /api/user/user-follow-stores?page=1&limit=2
export const APIGetListStoreFollow = async (page: number, limit: number) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/user-follow-stores?page=${page}&limit=${limit}`,
    { headers }
  );
  return res.data;
};

// /api/product/user-love-list?page=1&limit=4
export const APIGetListProductFavorite = async (
  page: number,
  limit: number
) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/user-love-list?page=${page}&limit=${limit}`,
    { headers }
  );
  return res.data;
};
