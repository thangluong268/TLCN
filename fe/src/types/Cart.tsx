export interface ProductBillDto {
    avatar: string[]
    productId: string
    productName: string
    quantity: number
    price: number
    type: string
}

export interface CartInterface {
    userId: string
    storeId: string
    storeName: string
    listProducts: ProductBillDto[]
    totalPrice: number
}

export interface CartData {
    total: number,
    carts: CartInterface[]
}