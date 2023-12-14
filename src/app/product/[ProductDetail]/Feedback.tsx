import Paging from "@/components/Paging";
import Star from "@/components/Star";
import { APICreateFeedback, APIGetFeedbackUser } from "@/services/Feedback";
import { UserInterface } from "@/types/User";
import ConvertDate from "@/utils/ConvertDate";
import { set } from "firebase/database";
import { useParams } from "next/navigation";
import React from "react";
import { FaRegPaperPlane } from "react-icons/fa";
interface Props {
  isPurchase: boolean;
  setTotalFeedback: (arg: number) => void;
}

function Feedback(props: Props) {
  const { isPurchase, setTotalFeedback } = props;
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [feedbacks, setFeedbacks] = React.useState([]);
  const params = useParams();
  const [user, setUser] = React.useState<UserInterface>();
  const [feedback, setFeedback] = React.useState<any>({
    star: 5,
    content: "",
  });
  React.useEffect(() => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") ?? "").providerData[0]
      : null;
    setUser(user);
    const fetchData = async () => {
      await APIGetFeedbackUser(page || 1, params.ProductDetail, user?._id).then(
        (res) => {
          setFeedbacks(res.metadata.data);
          setTotal(res.metadata.total);
          setTotalFeedback(res.metadata.total);
        }
      );
    };
    fetchData();
  }, [page]);
  const SendFeedback = async () => {
    await APICreateFeedback(params.ProductDetail + "", feedback).then(
      (res: any) => {
        if (res.status == 200 || res.status == 201) {
          setFeedbacks(
            feedbacks.concat({
              ...res.metadata.data,
              name: user?.fullName,
              avatar: user?.avatar,
            })
          );
          setTotalFeedback(total + 1);
          setFeedback({ star: 5, content: "" });
          HandleClick(5);
        }
      }
    );
  };
  const HandleClick = (star: number) => {
    setFeedback({ ...feedback, star: star });
    const feedbackEle = document.getElementById("feedback");
    const starList = feedbackEle?.getElementsByTagName("svg");
    for (let i = 0; i < starList!.length; i++) {
      if (i < star) {
        starList![i].classList.add("text-yellow-300");
      } else {
        starList![i].classList.remove("text-yellow-300");
      }
    }
  };
  return (
    <>
      {feedbacks!.map((item: any, index: any) => (
        <div key={index}>
          <article>
            <div className="flex items-center mb-4">
              <img
                className="w-10 h-10 me-4 rounded-full"
                src={item.avatar}
                alt=""
              ></img>
              <div className="font-medium dark:text-white">
                <p>
                  {item.name}
                  <div className="block text-sm text-gray-500 dark:text-gray-400">
                    {ConvertDate(item.createdAt)}
                  </div>
                </p>
              </div>
            </div>
            <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
              {Array.from({ length: 5 }, (_, index) => {
                return (
                  <Star
                    key={index}
                    state={index + 1 <= item.star ? true : false}
                  />
                );
              })}
            </div>

            <div
              className="my-2 text-gray-500 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></div>
            {item.userId != user?._id && (
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.consensus.length} người đồng thuận
                </p>
                <div className="flex items-center mt-3">
                  <a
                    href="#"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Đồng thuận
                  </a>
                  <a
                    href="#"
                    className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                  >
                    Báo cáo
                  </a>
                </div>
              </aside>
            )}
          </article>
          <hr className="w-full my-5" />
        </div>
      ))}
      <Paging
        totalPage={total}
        currentPage={page || 1}
        setPage={setPage}
        perPage={10}
      />
      {/* Viết bình luận và cho sao */}
      {user && isPurchase ? (
        <>
          <div id="feedback" className="flex items-center justify-center mb-2 ">
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(1)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(2)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(3)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(4)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="cursor-pointer w-5 h-5 text-yellow-300 me-1"
              onClick={() => HandleClick(5)}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          </div>
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 me-4 rounded-full"
              src={user?.avatar}
              alt=""
            ></img>
            <div className="font-medium dark:text-white w-full">
              <p>
                <textarea
                  rows={4}
                  value={feedback.content}
                  onChange={(e) =>
                    setFeedback({ ...feedback, content: e.target.value })
                  }
                  placeholder="Viết bình luận..."
                  className="w-full px-4 py-2 text-sm text-gray-900 bg-gray-100 border border-transparent rounded-lg outline-none"
                />
              </p>
            </div>
            {/* Button send */}
            <button
              type="button"
              className="ml-2 text-white bg-blue-700 h-full hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={(e) => SendFeedback()}
            >
              <FaRegPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <i>Hãy mua hàng để có thể bình luận nhé</i>
        </div>
      )}
    </>
  );
}

export default Feedback;
