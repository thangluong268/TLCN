import NotificationInterface from "@/types/NotificationInterface";
import QueryTwoElement from "@/types/QueryTwoElement";
import axios from "axios";


export const APIGetAllNotification = async ({ page, limit }: QueryTwoElement): Promise<{ total: number, notifications: NotificationInterface[] }> => {
  const authorization = localStorage.getItem('Authorization')
  const headers = {
    'Authorization': authorization,
  };
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/notification?page=${page}&limit=${limit}`,
    { headers }
  )
  return { total: res.data.total, notifications: res.data.notifications }
};