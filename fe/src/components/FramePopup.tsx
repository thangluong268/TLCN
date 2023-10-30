import React from 'react'

function FramePopup({ children }: any) {
    return (
        <div className="flex flex-col absolute right-[26%] top-16 rounded-lg p-2 bg-[#D2E0FB]">
            {children}
        </div>
    )
}

export default FramePopup