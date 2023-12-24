/* eslint-disable @typescript-eslint/no-explicit-any */

export const notificationMock = (): any => {
  return {
    userIdFrom: '6546696dfd6325186efcf4d7',
    userIdTo: '6546696dfd6325186efcf4d7',
    content: 'đã gửi cho bạn thông báo',
    type: 'Thông báo',
    status: false,
    sub: {
      fullName: 'Thang Luong',
      avatar: 'avatar',
      productId: '',
    },
  };
};

export const createNotificationMock = (): any => {
  return {
    userIdFrom: '6546696dfd6325186efcf4d7',
    userIdTo: '6546696dfd6325186efcf4d7',
    content: 'đã gửi cho bạn thông báo',
    type: 'Thông báo',
    sub: {
      fullName: 'Thang Luong',
      avatar: 'avatar',
      productId: '',
    },
  };
};
