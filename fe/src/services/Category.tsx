import axios from "axios";

export const APIGetAllCategory = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`);
  return res.data;
};
