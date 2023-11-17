"use client";
import Cart from '@/components/Cart';
import FrameCart from '@/components/FrameCart';
import { APIGetAllCart } from '@/services/Cart';
import { CartInterface } from '@/types/Cart';
import Toast from '@/utils/Toast';
import React from 'react'

function CartPage() {

    const [dataCart, setDataCart] = React.useState<CartInterface[]>([])

    React.useEffect(() => {
        const fetchCart = async () => {
            const res = await APIGetAllCart();
            if (res.status !== 200 && res.status !== 201) {
                Toast("error", res.message, 5000);
                return;
            }
            setDataCart(res.metadata.data)
        }
        fetchCart()
    }, [])

    return (
        <div className='min-h-screen px-[10%]'>
            {dataCart.length > 0 ? (
                <>
                    <div className='flex items-center p-10 mt-[2%] rounded-lg bg-white text-center font-bold text-sm'>
                        <div className="flex items-center w-[35%] mr-[5%]">
                            <input
                                className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[4%]"
                                type="checkbox"
                            //value={props._id}
                            //onChange={(e) => isChecked(false, e)}
                            ></input>
                            <span className='text-left'> Sản Phẩm </span>
                        </div>
                        <span className='w-[20%]'> Đơn Giá </span>
                        <span className='w-[20%]'> Số Lượng </span>
                        <span className='w-[20%]'> Số Tiền </span>
                        <span className='w-[15%]'> Thao Tác </span>
                    </div>

                    {dataCart.map((data) => (
                        <FrameCart props={data}>
                            {data.listProducts.map((item) => (
                                <Cart props={item} />
                            ))}
                        </FrameCart>
                    ))}
                </>
            ) : (
                <div className="flex justify-center items-center hover:bg-[#c1d2f6] p-2 rounded-lg">
                    <span className="text-[14px] cursor-default">
                        Không có sản phẩm nào
                    </span>
                </div>
            )}
        </div>
    )
}

export default CartPage