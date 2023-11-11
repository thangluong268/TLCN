
import axios from "axios";


export const APIGetUserById = async (id: string) => {
  const authorization = `Bearer ${localStorage.getItem('accessToken')}`
  const headers = {
    'Authorization': authorization,
  };
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/user/${id}`,
    { headers }
  )
  console.log(res.data)
  return res.data
};