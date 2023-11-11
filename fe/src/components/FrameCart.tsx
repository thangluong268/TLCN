import Link from 'next/link'
import React from 'react'

function FrameCart({ props, children }: { props: any, children: any }) {
    const { _id, storeName, totalPrice } = props
    return (
        <div className="flex flex-col mb-2 border-b-2 border-[#90b0f4]">
            <Link href={`/store/user/${_id}`} className="text-[12px] font-bold p-2">{storeName}</Link>
            {children}
            <p className="text-[12px] font-bold p-2 ml-[76%]">Tổng tiền: {totalPrice}</p>
        </div>
    )
}

export default FrameCart