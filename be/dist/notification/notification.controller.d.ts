import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserService } from '../user/user.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SuccessResponse } from '../core/success.response';
import { NotFoundException } from '../core/error.response';
export declare class NotificationController {
    private readonly notificationService;
    private readonly userService;
    constructor(notificationService: NotificationService, userService: UserService);
    create(notification: CreateNotificationDto): Promise<SuccessResponse>;
    getAllByUserId(page: number, limit: number, userId: string): Promise<SuccessResponse>;
    update(id: string, updateNoti: UpdateNotificationDto): Promise<SuccessResponse | NotFoundException>;
}
