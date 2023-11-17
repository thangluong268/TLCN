import FormatMoney from '@/utils/FormatMoney'
import Link from 'next/link'
import React from 'react'

function FrameCartPreview({ props, children }: { props: any, children: any }) {
    const { _id, storeName, totalPrice } = props
    return (
        <div className="flex flex-col items-end mb-2 border-b-2 border-[#90b0f4] max-w-full">
            <div className='mb-[15%]'>
                <Link href={`/store/user/${_id}`} className='flex items-center absolute left-2 hover:bg-[#c1d2f6] p-2 rounded-lg'>
                    <img
                        className="rounded-full w-[54px] h-[54px] mr-2"
                        src={props.avatar}
                        alt="Loading..."
                    />
                    <span className='text-[12px] font-bold p-2'>{storeName}</span>
                </Link>
            </div>

            {children}
            <p className="text-[12px] font-bold p-2">Tổng tiền: {FormatMoney(totalPrice)}</p>
        </div>
    )
}

export default FrameCartPreview