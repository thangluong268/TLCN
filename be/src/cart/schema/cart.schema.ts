import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";
import { ProductBillDto } from "src/bill/dto/product-bill.dto";

@Schema({
    timestamps: true,
})
export class Cart extends Document {
    @Prop()
    userId: mongoose.Types.ObjectId;

    @Prop()
    storeId: mongoose.Types.ObjectId;

    @Prop()
    storeName: string;

    @Prop({ type: [Object] })
    listProducts: ProductBillDto[];

    @Prop()
    totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

