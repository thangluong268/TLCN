import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

export const APICreateBill = async (body: any): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/user`,
    body,
    { headers }
  );
  return res.data;
};

// /api/bill/seller/count-total-by-status
export const APIGetCountBillByStatus = async (
  year: string = ""
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/seller/count-total-by-status?year=${year}`,
    { headers }
  );
  return res.data;
};

// api/bill/seller/calculate-revenue-by-year?year=2023
export const APIGetRevenueByYear = async (year: string = ""): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/seller/calculate-revenue-by-year?year=${year}`,
    { headers }
  );
  return res.data;
};

// api/bill/seller/count-charity-by-year?year=2023
export const APIGetCharityByYear = async (year: string = ""): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/seller/count-charity-by-year?year=${year}`,
    { headers }
  );
  return res.data;
};

// api/bill/seller/count-total-by-status?year=2023
export const APIGetCountBillByYear = async (year: number): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/seller/count-total-by-status?year=${year}`,
    { headers }
  );
  return res.data;
};

//api/bill/seller?status=
export const APIGetListBill = async (
  page: number,
  limit: number,
  status: string = ""
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/seller?page=${page}&limit=${limit}&status=${status}`,
    { headers }
  );
  return res.data;
};

// /api/bill/seller/:id => Put
export const APIUpdateBill = async (
  id: string,
  status: string
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/seller/${id}?status=${status}`,
    {},
    { headers }
  );
  return res.data;
};

// /api/bill/user/count-total-by-status
export const APIGetCountBillByStatusUser = async (): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/user/count-total-by-status`,
    { headers }
  );
  return res.data;
};

// /api/bill/user?page=&limit=&status
export const APIGetListBillUser = async (
  page: number,
  limit: number,
  status: string = ""
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/user?page=${page}&limit=${limit}&status=${status}`,
    { headers }
  );
  return res.data;
};

// /api/bill/user/657c6b868c3a7c4556f285ec
export const APIGetBillUser = async (id: string): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/user/${id}`,
    { headers }
  );
  return res.data;
};

// /api/bill/admin/count-total-data
export const APIGetCountBillAdmin = async (): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/admin/count-total-data`,
    { headers }
  );
  return res.data;
};

// api/bill/admin/calculate-total-revenue-by-year?year=2023
export const APIGetRevenueByYearAdmin = async (
  year: string = ""
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/admin/calculate-total-revenue-by-year?year=${year}`,
    { headers }
  );
  return res.data;
};

// /api/user/admin/users-most-bills?limit=4
export const APIGetUserMostBill = async (limit: number): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/admin/users-most-bills?limit=${limit}`,
    { headers }
  );
  return res.data;
};

// api/bill/user/:id?status=
export const APIUpdateBillUser = async (
  id: string,
  status: string
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/bill/user/${id}?status=${status}`,
    {},
    { headers }
  );
  return res.data;
};
