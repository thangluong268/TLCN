
import Home from "@/app/admin/Home";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
export const categoryAdminSlice = createSlice({
    name: "categoryAdmin",
    initialState: {
        items: {
            title: "Trang chủ",
            value: "home",
            element: Home,
        },
    },
    reducers: {
        setCategoryAdmin: (state, action: PayloadAction<any>) => {
            state.items = action.payload;
        },

    }
})


export const { setCategoryAdmin } = categoryAdminSlice.actions
export default categoryAdminSlice.reducer
