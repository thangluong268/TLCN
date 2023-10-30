'use client'
import Link from 'next/link';
import React from 'react'

function CartPreview({ props }: { props: any }) {
    return (
        <Link href="/cart/:id">
            <div className='flex justify-between max-w-[300px] items-center cursor-pointer hover:bg-[#c1d2f6] p-2 rounded-lg'>
                <img
                    className="rounded-full w-[54px] h-[54px] mr-2"
                    src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-1/333672359_223615343396138_7077399135899680905_n.jpg?stp=cp6_dst-jpg_p60x60&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=cTn9WrZsic0AX_AQIZb&_nc_ht=scontent.fsgn2-6.fna&oh=00_AfALiVYWauduHdwJD0z93BH0R1y4h53sgB68dxHEmYsAuw&oe=653D2D32"
                    alt="Loading..."
                />
                <p className="text-[12px] mr-2 text-ellipsis line-clamp-1 overflow-hidden">{props.productName}</p>
                <span className="text-[12px]">{props.price}</span>
            </div>
        </Link>
        
    )
}

export default CartPreview