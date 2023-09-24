import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './schema/evaluation.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { EmojiDto } from './dto/emoji.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class EvaluationService {
    constructor(
        @InjectModel(Evaluation.name)
        private readonly evaluationModel: Model<Evaluation>
    ) { }

    async create(productId: string): Promise<Evaluation> {
        try {
            const newEvaluation = await this.evaluationModel.create({ productId })
            return newEvaluation
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(userId: string, productId: string, body: string, type: string): Promise<boolean> {
        const evaluation = await this.evaluationModel.findOne({ productId })
        if (type == "emoji") {
            return this.updateEmoji(userId, body, evaluation)
        }
        else if (type == "comment") {
            return this.updateComment(userId, body, evaluation)
        }
        else {
            throw new NotFoundExceptionCustom("Action")
        }
    }

    async updateEmoji(userId: string, body: string, evaluation: Evaluation): Promise<boolean> {
        try {
            const index = evaluation.Emojis.findIndex(emoji => emoji.userId.toString() === userId.toString())
            const newEmoji = new EmojiDto()
            newEmoji.userId = userId
            newEmoji.name = body
            if (index == -1) {
                evaluation.Emojis.push(newEmoji)
            }
            else {
                if (evaluation.Emojis[index].name == body) {
                    evaluation.Emojis.splice(index, 1)
                }
                else {
                    evaluation.Emojis[index] = newEmoji
                }
            }
            await evaluation.save()
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async updateComment(userId: string, body: string, evaluation: Evaluation): Promise<boolean> {
        try {
            const index = evaluation.Comments.findIndex(cmt => cmt.userId.toString() === userId.toString())
            if (index == -1) {
                const newCmt = new CreateCommentDto()
                newCmt.userId = userId
                newCmt.content = body
                evaluation.Comments.push(newCmt)
            }
            else {
                const updatedCmt = new UpdateCommentDto()
                updatedCmt.userId = userId
                updatedCmt.content = body
                updatedCmt.createAt = evaluation.Comments[index].createAt
                evaluation.Comments[index] = updatedCmt
            }
            await evaluation.save()
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
