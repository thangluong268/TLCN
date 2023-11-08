import NotificationInterface from "@/types/Notification";
import QueryTwoElement from "@/types/QueryTwoElement";
import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";


export const APIGetAllNotification = async ({ page, limit }: QueryTwoElement): Promise<{ total: number, notifications: NotificationInterface[] }> => {
  const headers = GetHeaders()
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/notification?page=${page}&limit=${limit}`,
    { headers }
  )
  return { total: res.data.total, notifications: res.data.notifications }
};

export const APIUpdateNotification = async (id: string): Promise<boolean> => {
  const headers = GetHeaders()
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/notification/${id}`,
    { headers }
  )
  return res.data
};