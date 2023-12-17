"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreMock = void 0;
const createStoreMock = () => {
    return {
        avatar: "http://res.cloudinary.com/dl3b2j3td/image/upload/v1701732030/TLCN/t3nd0c2lqqzimswjneo5.png",
        name: "1231231",
        "address": "Cửa hàng mặc định",
        "phoneNumber": [
            "0978512345",
            "0987252522"
        ],
        description: "<p>3123 1</p>",
        warningCount: 0,
        status: true,
        createdAt: {
            "$date": "2023-12-04T23:20:31.825Z"
        },
        updatedAt: {
            "$date": "2023-12-04T23:20:31.873Z"
        },
        userId: "65473cecb303464b83b08e8b"
    };
};
exports.createStoreMock = createStoreMock;
//# sourceMappingURL=store.mock.js.map