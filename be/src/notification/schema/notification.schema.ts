import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true,
})
export class Notification extends Document {
    @Prop()
    userId: string;

    @Prop()
    content: string;

    @Prop()
    type: string;

    @Prop({default: false})
    status: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

