import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop({ type: String })
    avatar: string;

    @Prop({ type: String })
    fullName: string;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: String })
    address: string;

    @Prop({ type: String })
    phone: string;

    @Prop({ type: String })
    gender: string;

    @Prop({ type: String })
    birthday: string;

    @Prop({ type: [String], default: [] })
    friends: string[];

    @Prop({ type: [String], default: [] })
    followStores: string[];

    @Prop({ type: Number, default: 0 })
    warningCount: number;

    @Prop({ type: String, default: "true" })
    status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

