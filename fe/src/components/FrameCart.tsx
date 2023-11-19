import Link from 'next/link'
import React from 'react'
import { FaComments } from 'react-icons/fa'

function FrameCart({ props, children }: { props: any, children: any }) {
    const { _id, storeName, totalPrice } = props

    const checkedAllCart = () => {
        const lengthListCart = document.querySelectorAll('[class*="store-parent-"]').length;
        let checkedItems = 0;
        document.querySelectorAll('[class*="checkbox-store-"]').forEach((item: any) => {
            if (item.checked) {
                checkedItems++;
            }
        });
        const all = document.querySelector(`.checkbox-cart-all`) as HTMLInputElement;
        if (lengthListCart === checkedItems) {
            all.checked = true;
        } else {
            all.checked = false;
        }
    }

    const isCheckedCartAll = (e: any) => {
        document.querySelector(`.store-parent-${props._id}`)?.querySelectorAll('[class*="checkbox-item-"]').forEach((item: any) => {
            checkedAllCart();
            console.log(item);
            if (e.target.checked) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        });
        
    }
    return (
        <div className={`flex flex-col my-[1%] border-b-2 max-w-full bg-white rounded-lg p-6 store-parent-${props._id}`}>
            <div className='flex items-center p-2 rounded-lg'>
                <input
                    className={`w-4 h-4 border-2 border-slate-400 rounded-full min-w-[30px] mr-2 checkbox-store-${props._id}`}
                    type="checkbox"
                    value={props._id}
                    onChange={(e) => isCheckedCartAll(e)}
                >
                </input>
                <Link href={`/store/user/${_id}`} className='flex items-center mr-8'>
                    <img
                        className="rounded-full w-[54px] h-[54px] mr-[10%]"
                        src={props.storeAvatar}
                        alt="Loading..."
                    />
                    <span className='text-[14px] font-bold min-w-fit'>{storeName}</span>
                </Link >

                <FaComments className="w-[20px] h-[20px] cursor-pointer fill-[#77a0f3]" />
            </div>
            <div className="border-b-2 border-[#9cb6eb] m-4"></div>

            {children}
        </div>
    )
}

export default FrameCart