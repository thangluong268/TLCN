import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Product extends Document {
    @Prop()
    avatar: string;

    @Prop()
    quantity: number;

    @Prop()
    productName: string;

    @Prop()
    price: number;

    @Prop()
    description: string;

    @Prop()
    category: string;

    @Prop({type: [String]})
    keywords: string[];

    @Prop()
    type: string;

    @Prop({default: true})
    status: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId})
    storeId: Types.ObjectId;

    @Prop()
    storeName: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

