import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schema';
import { Model, MongooseError } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>
    ) { }

    async create(notification: CreateNotificationDto): Promise<Notification> {
        try {
            const newNotification = await this.notificationModel.create(notification)
            return newNotification
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllByUserId(userId: string, pageQuery: number, limitQuery: number)
        : Promise<{ total: number, notifications: Notification[] }> {
        const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT)
        const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT)
        const skip = limit * (page - 1)
        try {
            const total = await this.notificationModel.countDocuments({ userId })
            const notifications = await this.notificationModel.find({ userId }).limit(limit).skip(skip)
            return { total, notifications }
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(id: string): Promise<boolean> {
        try {
            const notification = await this.notificationModel.findById(id)
            if (!notification) { throw new NotFoundExceptionCustom(Notification.name) }
            notification.status = true
            await notification.save()
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
