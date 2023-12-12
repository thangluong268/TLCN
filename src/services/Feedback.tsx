import axios from "axios";

// /api/feedback?page=1&limit=1&productId=654745397c3886f34c7ae2c8&userId=1
export const APIGetFeedback = async (
  page?: any,
  limit?: any,
  productId?: any,
  userId?: any
) => {
  var page = page ? page : 1;
  var limit = limit ? limit : 10;
  var productId = productId ? productId : "";
  var userId = userId ? userId : "";
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/feedback?page=${page}&limit=${limit}&productId=${productId}&userId=${userId}`
  );
  return res.data;
};

// api/feedback-star?productId=654745397c3886f34c7ae2c8
export const APIGetFeedbackStar = async (productId: any) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/feedback-star?productId=${productId}`
  );
  return res.data;
};
