import { configureStore } from "@reduxjs/toolkit"
import cartPopupReducer from "./features/cart/cartpopup-slice"
import categoryStoreReducer from "./features/categoryStore/categoryStore-slice"
import { TypedUseSelectorHook, useSelector } from "react-redux"
export const store = configureStore({
    reducer: {
        cartPopupReducer,
        categoryStoreReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
