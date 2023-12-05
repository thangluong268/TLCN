import axios from "axios";

export const APIGetAllCategory = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
  localStorage.setItem("category", JSON.stringify(res.data.metadata.data));
  return res.data;
};
