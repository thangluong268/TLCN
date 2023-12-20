import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

// /api/report/user
export const APIReportUser = async (body: any) => {
  const headers = GetHeaders();
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/report/user`,
    body,
    { headers }
  );
  return res.data;
};

// /api/report/admin?page=1&limit=10&type=product
export const APIReportAdmin = async (page: any, limit: any, type: any) => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/report/admin?page=${page}&limit=${limit}&type=${type}`,
    { headers }
  );
  return res.data;
};

// /api/report/admin/:id => PUT
export const APIUpdateReport = async (id: string) => {
  const headers = GetHeaders();
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/report/admin/${id}`,
    {},
    { headers }
  );
  return res.data;
};

// /api/report/admin/:id => DELETE
export const APIDeleteReport = async (id: string) => {
  const headers = GetHeaders();
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/report/admin/${id}`,
    { headers }
  );
  return res.data;
};
