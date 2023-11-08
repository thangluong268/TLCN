'use client'
import NotificationInterface from '@/types/Notification';
import DifferenceTime from '@/utils/DifferenceTime';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaAngry, FaCommentMedical, FaGrinSquint, FaHeart, FaSadTear, FaSurprise, FaThumbsUp, FaUserPlus } from "react-icons/fa";

function Notification({ props }: { props: NotificationInterface }) {
  const { sub, content, type, updatedAt, userIdFrom } = props

  const router = useRouter()
  const handleAcceptClick = (e: any) => {
    e.preventDefault()
    router.push(`/user/add/:id`)
  };

  const iconType: any = {
    "Haha": <FaGrinSquint className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    "Love": <FaHeart className="w-[14px] h-[14px] fill-[#EF4D74]" />,
    "Wow": <FaSurprise className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    "Sad": <FaSadTear className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    "Angry": <FaAngry className="w-[14px] h-[14px] fill-[#e2b53c]" />,
    "Like": <FaThumbsUp className="w-[14px] h-[14px] fill-[#6499FF]" />,
    "Kết bạn": <FaUserPlus className="w-[14px] h-[14px] fill-[#6499FF]" />,
    "Thêm sản phẩm": <FaCommentMedical className="w-[14px] h-[14px] fill-[#6499FF]" />,
  }

  const navigation = (typeInput: string) => {
    return typeInput === "Kết bạn" ? `/user/user/${userIdFrom}` : `/product/${sub.productId}`
  }

  return (
    <Link href={`${navigation(type)}`}>
      <div className='flex items-center w-[300px] cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg' >

        <div className="flex flex-col justify-center items-center">
          <img
            className="rounded-full w-[54px] h-[54px]"
            src={sub.avatar}
            alt="Loading..."
          />
          <div className={`flex justify-center items-center w-[20px] h-[20px] bg-white rounded-full mt-[-16px] ml-[40px]`}>
            {iconType[type]}
          </div>
        </div>

        <div className="flex flex-col justify-start item-start ml-3">
          <p className={`text-[12px] text-ellipsis line-clamp-2 max-w-[90%] overflow-hidden`}>
            <span className="text-[12px] font-bold mr-1">{sub.fullName}</span>
            {content}
          </p>
          <p className="text-[10px]">
            <span className="text-[10px] mr-1">{DifferenceTime(updatedAt)}</span>
          </p>
          {type === "Kết bạn" &&
            (<>
              <p className="text-[10px]">
                <span className="text-[10px] mr-1">3</span>
                bạn chung
              </p>
              <div className="flex items-center">
                <button
                  className='w-[70px] h-[23px] bg-[#6499FF] text-[10px] font-bold text-white rounded-[5px] mr-2 hover:bg-[#75a0f0]'
                  onClick={handleAcceptClick}
                >
                  Chấp nhận
                </button>
                <button
                  className='w-[70px] h-[23px] bg-[#8A919F] text-[10px] font-bold text-white rounded-[5px] hover:bg-[#9398a1]'
                >
                  Từ chối
                </button>
              </div>
            </>
            )}
        </div>

      </div>
    </Link>
  )
}

export default Notification