import SortTable from "@/components/SortTable";
import { APIGetListUser } from "@/services/User";
import formatToDDMMYYYY from "@/utils/formatToDDMMYYYY";
import React from "react";
import Profile from "../user/profile/page";

interface ListUser {
  total: number;
  users: [
    {
      _id: string;
      avatar: string;
      fullName: string;
      email: string;
      password: string;
      address: [];
      phone: string;
      friends: [];
      followStores: [];
      wallet: number;
      warningCount: number;
      status: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }
  ];
}

function ManagerUser() {
  const arrTitleUser = [
    {
      title: "",
      sort: false,
      name: "index",
    },
    {
      title: "Tên người dùng",
      sort: false,
      name: "name",
    },
    {
      title: "Email",
      sort: false,
      name: "email",
    },
    {
      title: "Ngày tham gia",
      sort: false,
      name: "date",
    },
    {
      title: "",
      sort: false,
      name: "",
    },
  ];
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState<string>("");
  const [currentId, setCurrentId] = React.useState<string>("");
  const [listUser, setListUser] = React.useState<ListUser>({} as ListUser);
  const [isShow, setIsShow] = React.useState<boolean>(false);
  React.useEffect(() => {
    const fetchData = async () => {
      await APIGetListUser(page || 1, 10, search).then((res) =>
        setListUser(res.metadata.data)
      );
    };
    fetchData();
  }, [page, search]);
  return (
    <>
      {/* Search */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const search = document.getElementById(
            "default-search"
          ) as HTMLInputElement;
          setIsShow(false);
          setSearch(search.value);
        }}
        className="mb-5"
      >
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none "
            placeholder="Nhập thông tin tìm kiếm theo tên, email, số điện thoại"
          ></input>
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 py-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      <SortTable
        title={arrTitleUser}
        totalPage={listUser.total}
        currentPage={page}
        setPage={(data) => setPage(data)}
        perPage={10}
      >
        {listUser.users?.map((item, index) => (
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            key={index}
          >
            <td className="px-6 py-4 text-center">
              <img
                src={item.avatar}
                width={50}
                height={50}
                className="rounded-full mx-auto"
                alt=""
              />
            </td>
            <td className="px-6 py-4 text-center">{item.fullName}</td>
            <td className="px-6 py-4 text-center">{item.email}</td>
            <td className="px-6 py-4 text-center">
              {formatToDDMMYYYY(item.createdAt)}
            </td>
            <td>
              <div
                className="px-6 text-center font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                onClick={(e) => {
                  setCurrentId(item._id);
                  setIsShow(true);
                  ref.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Xem chi tiết
              </div>
            </td>
          </tr>
        ))}
      </SortTable>
      {currentId && isShow && (
        <div ref={ref}>
          <Profile
            idProps={currentId || ""}
            setIsShow={(data: boolean) => setIsShow(data)}
          />
        </div>
      )}
    </>
  );
}

export default ManagerUser;
