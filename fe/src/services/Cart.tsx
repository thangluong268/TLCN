import { CartData, CartInterface } from "@/types/Cart";
import { QueryThreeElement } from "@/types/Query";
import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

export const APIGetAllCartPaging = async ({ page, limit, search }: QueryThreeElement): Promise<any> => {
  const headers = GetHeaders()
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/user?page=${page}&limit=${limit}&search=${search}`,
    { headers }
  )
  return res.data
};


export const APIGetAllCart = async (): Promise<any> => {
  const headers = GetHeaders()
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/user/get-all`,
    { headers }
  )
  return res.data
};
