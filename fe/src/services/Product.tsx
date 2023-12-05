import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

export const APIGetListProductLasted = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/listProductLasted?limit=10`
  );
  return res.data;
};

export const APIGetListProducMostInStore = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/mostProductsInStore?limit=3`
  );
  return res.data;
};

export const APIGetProduct = async (id: any) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
  );
  return res.data;
};

export const APICreateProduct = async (data: any) => {
  const headers = GetHeaders();
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/product/seller`,
    data,
    { headers }
  );
  return res.data;
};
