import { QueryThreeElement } from "@/types/Query";
import GetHeaders from "@/utils/GetHeaders";
import Toast from "@/utils/Toast";
import axios from "axios";

export const APIGetAllCartPaging = async ({
  page,
  limit,
  search,
}: QueryThreeElement): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/user?page=${page}&limit=${limit}&search=${search}`,
    { headers }
  );
  return res.data;
};

export const APIGetAllCart = async (): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/user/get-all`,
    { headers }
  );
  return res.data;
};

export const APIRemoveProductInCart = async (
  productId: string
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/user?productId=${productId}`,
    { headers }
  );
  return res.data;
};

export const APIAddProductInCart = async (productId: string): Promise<any> => {
  try {
    const headers = GetHeaders();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/user?productId=${productId}`,
      {},
      { headers }
    );
    return res.data;
  } catch (error) {
    window.location.href = "/login";
  }
};
