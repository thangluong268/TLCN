import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";
import { ProductBillDto } from "../dto/product-bill.dto";

@Schema({
    timestamps: true,
})
export class Bill extends Document {
    @Prop()
    userId: mongoose.Types.ObjectId;

    @Prop()
    fullName: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    storeId: mongoose.Types.ObjectId;

    @Prop()
    storeName: string;

    @Prop({ type: [String] })
    listProducts: ProductBillDto[];

    @Prop()
    totalPrice: number;

    @Prop()
    promotionId: mongoose.Types.ObjectId;

    @Prop()
    promotionName: string;

    @Prop()
    promotionValue: number;

    @Prop()
    paymentMethod: string;

    @Prop({ default: "Đã đặt" })
    status: string;


}

export const BillSchema = SchemaFactory.createForClass(Bill);

