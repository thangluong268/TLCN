import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { type } from "os";

export enum RoleName {
    USER = 'User',
    SELLER = 'Seller',
    MANAGER = 'Manager',
    ADMIN = 'Admin',
}

@Schema({
    timestamps: true,
})
export class Role extends Document {
    @Prop()
    name: RoleName;

    @Prop({type: [mongoose.Schema.Types.ObjectId], default: []})
    listUser: mongoose.Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
