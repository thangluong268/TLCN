import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Feedback extends Document {
    @Prop()
    productId: mongoose.Types.ObjectId;

    @Prop()
    userId: mongoose.Types.ObjectId;

    @Prop()
    content: string;

    @Prop()
    star: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

