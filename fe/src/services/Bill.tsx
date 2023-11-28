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
