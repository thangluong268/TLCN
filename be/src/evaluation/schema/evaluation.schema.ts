import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";
import { EmojiDto } from "../dto/emoji.dto";
import { CreateCommentDto } from "../dto/create-comment.dto";

@Schema({
    timestamps: true,
})
export class Evaluation extends Document {
    @Prop()
    productId: string;

    @Prop({ type: [Object], default: [] })
    Emojis: EmojiDto[];

    @Prop({ type: [Object], default: [] })
    Comments: CreateCommentDto[];
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);

