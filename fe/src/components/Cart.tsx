'use client'
import FormatMoney from '@/utils/FormatMoney';
import Link from 'next/link';
import React from 'react'

function Cart({ props }: { props: any }) {

    const [quantity, setQuantity] = React.useState(props.quantity)

    const handleDecrease = () => {
        setQuantity(quantity - 1)
    }

    const handleIncrease = () => {
        setQuantity(quantity + 1)
    }

    return (
        <div className='flex justify-between items-center p-2 rounded-lg text-center'>
            <div className='flex items-center w-[35%] mr-[5%]'>
                <input
                    className="w-4 h-4 border-2 border-slate-400 rounded-full mr-[2%] min-w-[30px]"
                    type="checkbox"
                //value={props._id}
                //onChange={(e) => isChecked(false, e)}
                ></input>
                <img
                    className="rounded-full w-[54px] h-[54px] mr-2"
                    src={props.avatar}
                    alt="Loading..."
                />
                <Link
                    href={`/product/${props.productId}`}
                    className="text-[14px] mr-2 text-ellipsis line-clamp-2 text-left">
                    {props.productName}
                </Link>
            </div>

            <span className="text-[14px] w-[20%]">{FormatMoney(props.price)}</span>

            <div className="flex items-center justify-center">
                <button className="px-2 py-1 border border-[#b6caf2] rounded-l-lg" onClick={() => handleDecrease()}>
                    -
                </button>

                <input
                    className="px-3 py-1 border-t border-b border-[#b6caf2] text-center w-[20%] outline-none"
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                />

                <button className="px-2 py-1 border border-[#b6caf2] rounded-r-lg" onClick={() => handleIncrease()}>
                    +
                </button>
            </div>


            <span className="text-[14px] w-[20%]">{FormatMoney(props.price * props.quantity)}</span>

            <div className='flex flex-col items-center w-[15%]'>
                <span className='text-[14px]'>Xóa</span>
                <span className='text-[14px] max-w-[70%]'>Tìm sản phẩm tương tự</span>
            </div>
        </div>

    )
}

export default Cart