'use client'
import { APIGetAllNotification } from '@/services/Notification';
import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import LoadingPopup from './LoadingPopup';
import { APIGetAllCart } from '@/services/Cart';
import FrameCart from './FrameCart';
import Cart from './Cart';

function FramePopup({ total, component, children }: { total: number, component: string, children: any }) {
    const [items, setItems] = useState<JSX.Element>(children);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(2); // phải bắt đầu từ 2 vì page 1 đã load rồi

    const handleScroll = async () => {
        const framePopup = document.getElementById('frame-popup');
        if (framePopup) {
            const isAtBottom = framePopup.scrollTop + framePopup.clientHeight > framePopup.scrollHeight - 500;
            if (isAtBottom && !loading && ((page - 1) * 5 < total)) {
                setLoading(true)
                let nextData: any
                let updateData: JSX.Element[] = []
                if (component === "notification") {
                    nextData = await APIGetAllNotification({ page, limit: 5 })
                    updateData = nextData.metadata.data.notifications.map((item: any) => (
                        <Notification props={item} />
                    ))
                }
                else {
                    nextData = await APIGetAllCart({ page, limit: 5, search: "" })
                    updateData = nextData.metadata.data.carts.map((data: any) => (
                        <FrameCart props={data}>
                            {data.listProducts.map((item: any) => (
                                <>
                                    <Cart props={item} />
                                </>
                            ))}
                        </FrameCart>
                    ))
                }

                setItems(<>{items}{updateData}</>)
                setLoading(false)
                setPage(page + 1)
            }
        }
    }

    useEffect(() => {
        const framePopup = document.getElementById('frame-popup');
        if (framePopup) {
            framePopup.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (framePopup) {
                framePopup.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading]);

    return (
        <div
            id='frame-popup'
            className={`flex flex-col absolute right-[25%] top-16 rounded-lg p-2 bg-[#D2E0FB] overflow-y-scroll scrollbar-hide min-h-[150%] max-h-[600%]`}
        >
            {items}
            {/* khi scroll đến cuối thì đã load và page + 1 lên rồi nên phải trừ đi 1 để xét trước khi load */}
            {loading && ((page - 1) * 5 < total) && <><LoadingPopup /> <LoadingPopup /></>}
        </div>
    );
}

export default FramePopup;
