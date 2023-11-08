interface SubNoti {
    fullName: string
    avatar: string
    productId: string
}
export default interface NotificationInterface {
    _id: string;
    userIdFrom: string;
    userIdTo: string;
    content: string;
    type: string;
    status: boolean;
    updatedAt: Date;
    sub: SubNoti
}