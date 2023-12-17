"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBillMock = exports.billMock = void 0;
const billMock = () => {
    return {
        storeId: "656e5ebf3b88272ad608fffd",
        listProducts: [
            {
                "productId": "657764dd17ee5e295b68e61c",
                "quantity": 2,
                "type": "SELL"
            },
        ],
        notes: "notes test",
        totalPrice: 4800000,
        deliveryFee: 60000,
        deliveryMethod: "Express",
        paymentMethod: "CASH",
        receiverInfo: {
            "fullName": "Test",
            "phoneNumber": "0989876565",
            "address": "test"
        },
        status: "NEW"
    };
};
exports.billMock = billMock;
const createBillMock = () => {
    return {
        data: [
            {
                storeId: "656e5ebf3b88272ad608fffd",
                listProducts: [
                    {
                        "productId": "657764dd17ee5e295b68e61c",
                        "quantity": 2,
                        "type": "SELL"
                    },
                ],
                notes: "notes test",
                totalPrice: 4800000
            }
        ],
        deliveryFee: 60000,
        deliveryMethod: "Express",
        paymentMethod: "CASH",
        receiverInfo: {
            "fullName": "Test",
            "phoneNumber": "0989876565",
            "address": "test"
        },
    };
};
exports.createBillMock = createBillMock;
//# sourceMappingURL=bill.mock.js.map