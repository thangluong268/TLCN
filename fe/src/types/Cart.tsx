export interface ProductBillDto {
    avatar: string[]
    productId: string
    productName: string
    quantity: number
    price: number
    type: string
}

export interface CartInterface {
    _id: string
    userId: string
    storeId: string
    storeAvatar: string
    storeName: string
    listProducts: ProductBillDto[]
    totalPrice: number
}

export interface CartData {
    total: number,
    carts: CartInterface[]
}