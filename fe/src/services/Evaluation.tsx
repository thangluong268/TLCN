import axios from "axios";
import GetHeaders from "@/utils/GetHeaders";

// api/evaluation?productId=654745397c3886f34c7ae2c8&userId=654745397c3886f34c7ae2c8
export const APIGetEvaluation = async (productId: any, userId?: any) => {
  var userId = userId ? userId : "";
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/evaluation?productId=${productId}&userId=${userId}`
  );
  return res.data;
};

// /api/evaluation/user?productId=123123
export const APIGetEvaluationUser = async (productId: any, body: any) => {
  const headers = GetHeaders();
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/evaluation/user?productId=${productId}`,
    body,
    { headers }
  );
  return res.data;
};
