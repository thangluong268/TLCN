'use client'
import Link from 'next/link';
import React from 'react'

function Cart({ props }: { props: any }) {
    return (
        <Link href="/cart/:id">
            <div className='flex justify-between items-center w-[500px] cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg'>
                <img
                    className="rounded-full w-[54px] h-[54px] mr-2"
                    src={props.avatar}
                    alt="Loading..."
                />
                <span className='text-[12px]'>x{props.quantity}</span>
                <p className="text-[12px] mr-2 text-ellipsis line-clamp-1 overflow-hidden max-w-[50%]">{props.productName}</p>
                <span className="text-[12px]">{props.price}</span>
            </div>
        </Link>
        
    )
}

export default Cart