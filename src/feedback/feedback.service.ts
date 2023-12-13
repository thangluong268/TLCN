import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './schema/feedback.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name)
        private readonly feedbackModel: Model<Feedback>
    ) { }

    async create(userId: string, productId: string, feedback: CreateFeedbackDto): Promise<Feedback> {
        try {
            const newFeedback = await this.feedbackModel.create(feedback)
            newFeedback.userId = userId
            newFeedback.productId = productId
            await newFeedback.save()
            return newFeedback
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getAllByProductIdPaging(page: number = 1, limit: number = 5, productId: string)
        : Promise<{ total: number, feedbacks: Feedback[] }> {

        const skip = limit * (page - 1);

        try {
            const total = await this.feedbackModel.countDocuments({ productId });
            const feedbacks = await this.feedbackModel.find({ productId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);

            return { total, feedbacks };

        } catch (err) {
            if (err instanceof MongooseError) {
                throw new InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }

    async getAllByProductId(productId: string): Promise<Feedback[]> {

        try {
            const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 })

            return feedbacks;

        } catch (err) {
            if (err instanceof MongooseError) {
                throw new InternalServerErrorExceptionCustom();
            }
            throw err;
        }
    }

}