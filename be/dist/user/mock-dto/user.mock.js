"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserMock2 = exports.createUserMock = void 0;
const createUserMock = () => {
    return {
        fullName: "Thắng Lương",
        email: "luongthangg268@gmail.com",
        password: "$2b$10$9MjWWmmb9oP4Owr6grbKrefGc9JY4SsCwE94D8JoC6khnuIqnk05i",
        address: [
            {
                receiverName: "3123",
                receiverPhone: "0123123123",
                address: "2",
                "default": true
            },
            {
                receiverName: "1231",
                receiverPhone: "0987654321",
                address: "1231",
                default: false
            },
            {
                receiverName: "Thang Luong",
                receiverPhone: "0989876710",
                address: "q7",
                default: false
            },
            {
                receiverName: "Hai Dang 1",
                receiverPhone: "0989876762",
                address: "Thu Duc",
                default: false
            },
            {
                receiverName: "Ban Than 1",
                receiverPhone: "0989876112",
                address: "q9",
                default: false
            }
        ],
        friends: [],
        followStores: [
            "656766a44539aeacb34c50f6"
        ],
        wallet: 0,
        warningCount: 0,
        status: true,
        createdAt: {
            "$date": "2023-11-05T06:57:48.659Z"
        },
        updatedAt: {
            "$date": "2023-12-05T15:57:54.732Z"
        },
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWvRBKQ78rfLVw4-qlKDl0NTS7pNcf0xVJ-xljgMfevoEujQQ9T5RUrVFcfPwcUlJxjo&usqp=CAU",
        phone: "0978512345"
    };
};
exports.createUserMock = createUserMock;
const createUserMock2 = () => {
    return {
        fullName: 'Thắng Lương',
        email: 'luongthang730@gmail.com',
        password: '$2b$10$9MjWWmmb9oP4Owr6grbKrefGc9JY4SsCwE94D8JoC6khnuIqnk05i',
        address: [
            {
                receiverName: '3123',
                receiverPhone: '0123123123',
                address: '2',
                default: true,
            },
            {
                receiverName: '1231',
                receiverPhone: '0987654321',
                address: '1231',
                default: false,
            }
        ],
        friends: [],
        followStores: ['656766a44539aeacb34c50f6'],
        wallet: 0,
        warningCount: 0,
        status: true,
        createdAt: {
            $date: '2023-11-05T06:57:48.659Z',
        },
        updatedAt: {
            $date: '2023-12-05T15:57:54.732Z',
        },
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWvRBKQ78rfLVw4-qlKDl0NTS7pNcf0xVJ-xljgMfevoEujQQ9T5RUrVFcfPwcUlJxjo&usqp=CAU',
        phone: '0978512345',
    };
};
exports.createUserMock2 = createUserMock2;
//# sourceMappingURL=user.mock.js.map