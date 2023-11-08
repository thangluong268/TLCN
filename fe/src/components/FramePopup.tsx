'use client'
import { APIGetAllNotification } from '@/services/Notification';

import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import LoadingPopup from './LoadingPopup';

function FramePopup({ total, children }: {total: number, children: any}) {
    const [items, setItems] = useState<JSX.Element>(children);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(2); // phải bắt đầu từ 2 vì page 1 đã load rồi

    const handleScroll = async () => {
        const framePopup = document.getElementById('frame-popup');
        if (framePopup) {
            const isAtBottom = framePopup.scrollTop + framePopup.clientHeight > framePopup.scrollHeight;
            if (isAtBottom && !loading) {
                setLoading(true)
                const nextData = await APIGetAllNotification({ page, limit: 5 })
                const updateData = nextData.notifications.map((item) => (
                    <Notification props={item} />
                ))
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
            className={`flex flex-col absolute right-[25%] top-16 rounded-lg p-2 bg-[#D2E0FB] overflow-y-scroll scrollbar-hide min-h-[150%] max-h-[700%]`}
        >
            {items}
            {/* khi scroll đến cuối thì đã load và page + 1 lên rồi nên phải trừ đi 1 để xét trước khi load */}
            {loading && ((page - 1)*5 < total) && <><LoadingPopup /> <LoadingPopup /></>}
        </div>
    );
}

export default FramePopup;
