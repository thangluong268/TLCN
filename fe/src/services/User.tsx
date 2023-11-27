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
    {
      address: body,
    },
    { headers }
  );
  return res.data;
};
