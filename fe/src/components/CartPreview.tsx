'use client'
import FormatMoney from '@/utils/FormatMoney';
import Link from 'next/link';
import React from 'react'

function CartPreview({ props }: { props: any }) {
    return (
        <Link href={`/product/${props.productId}`}>
            <div className='flex justify-between items-center w-[500px] cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg'>
                <img
                    className="rounded-full w-[54px] h-[54px] mr-2"
                    src={props.avatar}
                    alt="Loading..."
                />
                <span className='text-[12px]'>x{props.quantity}</span>
                <p className="text-[12px] mr-2 text-ellipsis line-clamp-1 overflow-hidden max-w-[50%]">{props.productName}</p>
                <span className="text-[12px]">{FormatMoney(props.price)}</span>
            </div>
        </Link>
        
    )
}

export default CartPreview