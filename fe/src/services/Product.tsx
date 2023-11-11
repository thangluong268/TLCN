import axios from "axios";

export const GetListProductLasted = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/listProductLasted?limit=10`
  );
  return res.data;
};

export const GetListProducMostInStore = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/mostProductsInStore?limit=3`
  );
  return res.data;
};

export const GetProduct = async (id: any) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
  );
  return res.data;
};
