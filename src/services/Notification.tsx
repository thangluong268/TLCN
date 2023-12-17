import { NotiData, NotificationInterface, SubNoti } from "@/types/Notification";
import { QueryTwoElement } from "@/types/Query";
import GetHeaders from "@/utils/GetHeaders";
import axios from "axios";

interface UpdateNotiInterface {
  content?: string;
  status: boolean;
  sub: SubNoti;
}

export const APIGetAllNotification = async ({
  page,
  limit,
}: QueryTwoElement): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/notification?page=${page}&limit=${limit}`,
    { headers }
  );
  return res.data;
};

export const APIUpdateNotification = async (
  id: string,
  updateNoti: any
): Promise<any> => {
  const headers = GetHeaders();
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/notification/${id}`,
    { ...updateNoti },
    { headers }
  );
  return res.data;
};
