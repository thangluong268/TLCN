import axios from "axios";

export const APIUploadImage = async (file: any) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    file
  );
  return res.data;
};
