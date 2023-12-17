import { SubNoti } from "./sub-notification.dto";
export declare class CreateNotificationDto {
    userIdFrom: string;
    userIdTo: string;
    content: string;
    type: string;
    sub: SubNoti;
}
