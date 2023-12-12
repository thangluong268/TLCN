import axios from "axios";

export const APIGetAllCategory = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
  localStorage.setItem("category", JSON.stringify(res.data.metadata.data));
  return res.data;
};

// api/product-filter?page=1&limit=1&search=1&priceMin=100000&priceMax=300000&quantityMin=1&quantityMax=10&createdAtMin=2023-01-01&createdAtMax=2024-01-01
export const APIGetListProductWithCategory = async (
  page?: any,
  limit?: any,
  search?: any,
  priceMin?: any,
  priceMax?: any,
  quantityMin?: any,
  quantityMax?: any,
  createdAtMin?: any,
  createdAtMax?: any
) => {
  var page = page ? page : 1;
  var limit = limit ? limit : 10;
  var search = search ? search : "";
  var priceMin = priceMin ? priceMin : "";
  var priceMax = priceMax ? priceMax : "";
  var quantityMin = quantityMin ? quantityMin : "";
  var quantityMax = quantityMax ? quantityMax : "";
  var createdAtMin = createdAtMin ? createdAtMin : "";
  var createdAtMax = createdAtMax ? createdAtMax : "";
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product-filter?page=${page}&limit=${limit}&search=${search}&priceMin=${priceMin}&priceMax=${priceMax}&quantityMin=${quantityMin}&quantityMax=${quantityMax}&createdAtMin=${createdAtMin}&createdAtMax=${createdAtMax}`
  );
  return res.data;
};
