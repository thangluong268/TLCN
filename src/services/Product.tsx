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
  document.getElementById("loading-page")?.classList.add("hidden");
  return res.data;
};

// api/product/seller?page=1&limit=10&search="ssss"
export const APIGetListProduct = async (
  page?: any,
  limit?: any,
  search?: any,
  sortType?: any,
  sortValue?: any
) => {
  const headers = GetHeaders();
  var search = search ? search : "";
  var page = page ? page : 1;
  var limit = limit ? limit : 10;
  var sortType = sortType ? sortType : "";
  var sortValue = sortValue ? sortValue : "";
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/seller?page=${page}&limit=${limit}&search=${search}&sortType=${sortType}&sortValue=${sortValue}`,
    { headers }
  );
  return res.data;
};

// api/product/seller => Patch
export const APIUpdateProduct = async (id: string, data: any) => {
  const headers = GetHeaders();
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/seller/${id}`,
    data,
    { headers }
  );
  return res.data;
};

///api/product/:id => Delete
export const APIDeleteProduct = async (id: string) => {
  const headers = GetHeaders();
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
    { headers }
  );
  return res.data;
};

// api/product/random
export const APIGetListProductRandom = async (limit?: any) => {
  document.getElementById("loading-page")?.classList.remove("hidden");

  var limit = limit ? limit : 10;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/random?limit=${limit}`
  );
  document.getElementById("loading-page")?.classList.add("hidden");

  return res.data;
};

// api/product
export const APIGetListProductForUser = async (
  page?: any,
  limit?: any,
  search?: any
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product?page=${page}&limit=${limit}&search=${search}`
  );
  return res.data;
};
