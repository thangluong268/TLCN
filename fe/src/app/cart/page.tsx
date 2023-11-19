"use client";
import Cart from '@/components/Cart';
import FrameCart from '@/components/FrameCart';
import { APIGetAllCart } from '@/services/Cart';
import { CartInterface } from '@/types/Cart';
import Toast from '@/utils/Toast';
import React from 'react'
import { FaCartPlus } from 'react-icons/fa';

function CartPage() {

    const [dataCart, setDataCart] = React.useState<CartInterface[]>([])
    const [indexDel, setIndexDel] = React.useState<string | null>(null)
    const [numberOrder, setNumberOrder] = React.useState<number>(0)
    const [dataOrder, setDataOrder] = React.useState<any[]>([])

    React.useEffect(() => {

        if (localStorage.getItem('cart')) {
            setDataCart(JSON.parse(localStorage.getItem('cart') || '{}'))
            return
        }

        const fetchCart = async () => {
            const res = await APIGetAllCart();
            if (res.status !== 200 && res.status !== 201) {
                Toast("error", res.message, 5000);
                return;
            }
            setDataCart(res.metadata.data)
            localStorage.setItem('cart', JSON.stringify(res.metadata.data))
        }
        fetchCart()

    }, [])

    const handleDelete = (index: string) => {
        setIndexDel(index)
    }

    const isCheckedCartAll = (e: any) => {
        document.querySelectorAll('[class*="checkbox-store-"]').forEach((item: any) => {
            if (e.target.checked) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        });
        document.querySelectorAll('[class*="checkbox-item-"]').forEach((item: any) => {
            if (e.target.checked) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        });
    }

    const countOrder = (orders: any[]): number => {
        var count = 0
        orders.forEach((item: any) => {
            count += item.listProducts.length
        })
        return count
    }

    const passData = () => {
        const data = document.querySelectorAll('[class*="store-parent-"]')
        var arr: any = []
        data.forEach((item: any) => {
            var temp: { idStore: string, listProducts: string[] } = {
                idStore: '',
                listProducts: []
            };

            temp = {
                idStore: item.querySelector('[class*="checkbox-store-"]')?.value,
                listProducts: []
            };
            var listItem = item.querySelectorAll('[class*="checkbox-item-"]');
            listItem.forEach((item: any) => {
                if (item.checked) {
                    temp.listProducts.push(item.value);
                }
            });
            arr.push(temp);
        });

        setNumberOrder(countOrder(arr))

        localStorage.setItem('order', JSON.stringify(arr))
    }

    React.useEffect(() => {
        const data = document.querySelectorAll('[class*="store-parent-"]')
        var arr: any = []
        data.forEach((item: any) => {
            var temp: { idStore: string, listProducts: string[] } = {
                idStore: '',
                listProducts: []
            };

            temp = {
                idStore: item.querySelector('[class*="checkbox-store-"]')?.value,
                listProducts: []
            };
            var listItem = item.querySelectorAll('[class*="checkbox-item-"]');
            listItem.forEach((item: any) => {
                if (item.checked) {
                    temp.listProducts.push(item.value);
                }
            });
            arr.push(temp);
        });

        setDataOrder(arr)
        setNumberOrder(countOrder(arr))

    }, [dataOrder])




    return (
        <div className='min-h-screen px-[10%]'>
            {dataCart.length > 0 ? (
                <>
                    <div className='flex items-center p-10 mt-[2%] rounded-lg bg-white text-center font-bold text-sm'>
                        <div className="flex items-center w-[35%] mr-[5%]">
                            <input
                                className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[4%] checkbox-cart-all"
                                type="checkbox"
                                onChange={(e) => isCheckedCartAll(e)}
                            ></input>
                            <span className='text-left'> Sản Phẩm</span>
                        </div>
                        <span className='w-[20%]'> Đơn Giá </span>
                        <span className='w-[20%]'> Số Lượng </span>
                        <span className='w-[20%]'> Số Tiền </span>
                        <span className='w-[15%]'> Thao Tác </span>
                    </div>

                    {dataCart.map((data) => (
                        <FrameCart props={data}>
                            {data.listProducts.map((item, index) => (
                                <div className={`${indexDel === `${data._id}-${index}` ? "hidden" : ""}`}>
                                    <Cart prop={item} idStore={data._id} index={index} handleDelete={(res: string) => handleDelete(res)} />
                                </div>
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


            <div className="flex flex-col rounded-lg bg-white p-4 mb-[5%]">

                <div className="flex items-center justify-end mx-[2%] p-4">
                    <FaCartPlus className="w-[24px] h-[24px] fill-[#77a0f3] mr-2 fill-" />
                    <span className="text-[16px] font-medium">DTEX Voucher</span>
                    <span className="text-[14px] ml-[20%] font-medium text-[#648fe3]">Chọn Voucher</span>
                </div>

                <div className="flex items-center justify-between mx-[2%]">

                    <div className="flex items-center">
                        <input
                            className="w-4 h-5 border-2 border-slate-400 rounded-full mr-[2%] checkbox-cart-all min-w-[30px]"
                            type="checkbox"
                            onChange={(e) => isCheckedCartAll(e)}
                        ></input>
                        <span className='text-[16px] min-w-[100%]'>Chọn Tất Cả</span>
                    </div>

                    <p className='text-[16px] mr-[-25%]'>Tổng thanh toán ({numberOrder} Sản Phẩm): <span>0đ</span></p>

                    <button
                        className='w-[15%] h-[10%] bg-[#648fe3] rounded-lg p-2'
                        onClick={e => passData()}
                    >
                        Đặt Hàng
                    </button>
                </div>



            </div>

        </div>
    )
}

export default CartPage