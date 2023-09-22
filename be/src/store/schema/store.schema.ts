import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Store extends Document {
    @Prop()
    userId: mongoose.Types.ObjectId;

    @Prop()
    avatar: string;

    @Prop()
    storeName: string;

    @Prop()
    address: string;

    @Prop()
    phone: string;

    @Prop({default: 0})
    warning: number;

    @Prop({default: true})
    status: boolean
}

export const StoreSchema = SchemaFactory.createForClass(Store);

