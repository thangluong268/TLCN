import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './schema/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
  ) {}

  async create(userId: string, productId: string, feedback: CreateFeedbackDto): Promise<Feedback> {
    try {
      const newFeedback = await this.feedbackModel.create(feedback);
      newFeedback.userId = userId;
      newFeedback.productId = productId;
      await newFeedback.save();
      return newFeedback;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAllByProductIdPaging(page: number = 1, limit: number = 5, productId: string): Promise<{ total: number; feedbacks: Feedback[] }> {
    const skip = limit * (page - 1);

    try {
      const total = await this.feedbackModel.countDocuments({ productId });
      const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 }).limit(limit).skip(skip);

      return { total, feedbacks };
    } catch (err) {
      if (err instanceof MongooseError) {
        throw new InternalServerErrorExceptionCustom();
      }
      throw err;
    }
  }

  async countTotal(productId: string): Promise<number> {
    try {
      return await this.feedbackModel.countDocuments({ productId });
    } catch (err) {
      if (err instanceof MongooseError) {
        throw new InternalServerErrorExceptionCustom();
      }
      throw err;
    }
  }

  async getAllByProductId(productId: string): Promise<Feedback[]> {
    try {
      const feedbacks = await this.feedbackModel.find({ productId }).sort({ createdAt: -1 });

      return feedbacks;
    } catch (err) {
      if (err instanceof MongooseError) {
        throw new InternalServerErrorExceptionCustom();
      }
      throw err;
    }
  }

  async updateConsensus(userId: string, productId: string, userIdConsensus: string): Promise<Feedback> {
    try {
      const feedback: Feedback = await this.feedbackModel.findOne({ userId, productId });

      if (!feedback) return null;

      const index = feedback.consensus.findIndex(id => id.toString() === userIdConsensus.toString());

      index == -1 ? feedback.consensus.push(userIdConsensus) : feedback.consensus.splice(index, 1);

      await feedback.save();

      return feedback;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
