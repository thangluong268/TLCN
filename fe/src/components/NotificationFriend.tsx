'use client'
import Link from 'next/link';
import React from 'react'
import { FaUserPlus } from "react-icons/fa";
import { useRouter } from 'next/navigation';

function NotificationFriend({ props }: { props: any }) {
    const router = useRouter()
    const handleAcceptClick = (e: any) => {
        e.preventDefault()
        router.push(`/user/add/:id`)
    };
    return (
        <Link href="/user/:id">
            <div className='flex items-center w-[300px]  cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg'>

                <div className="flex flex-col justify-center items-center">
                    <img
                        className="rounded-full w-[54px] h-[54px]"
                        src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-1/333672359_223615343396138_7077399135899680905_n.jpg?stp=cp6_dst-jpg_p60x60&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=cTn9WrZsic0AX_AQIZb&_nc_ht=scontent.fsgn2-6.fna&oh=00_AfALiVYWauduHdwJD0z93BH0R1y4h53sgB68dxHEmYsAuw&oe=653D2D32"
                        alt="Loading..." />
                    <div className='flex justify-center items-center w-[20px] h-[20px] bg-[#6499FF] rounded-full mt-[-16px] ml-[40px]'>
                        <FaUserPlus className="w-[14px] h-[14px] fill-white" />
                    </div>
                </div>

                <div className="flex flex-col justify-start item-start ml-3">
                    <p className="text-[12px]">
                        <span className="text-[12px] font-bold mr-1">{props.userName}</span>
                        {props.content}
                    </p>
                    <p className="text-[10px]">
                        <span className="text-[10px] mr-1">2</span>
                        giờ trước
                    </p>
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
                </div>

            </div>
        </Link>
    )
}

export default NotificationFriend