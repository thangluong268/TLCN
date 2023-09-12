import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, Document, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class User extends Document {
    @Prop()
    avatar: string;

    @Prop()
    fullName: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    address: string;

    @Prop()
    phone: string;

    @Prop()
    gender: string;

    @Prop()
    birthday: Date;

    @Prop({default: []})
    listFriends: Array<string>;

    @Prop({default: []})
    listFollows: Array<string>;

    @Prop({default: 0})
    warning: number;

    @Prop({default: true})
    status: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);

