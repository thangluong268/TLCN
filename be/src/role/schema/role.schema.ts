import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { User } from "src/user/schema/user.schema";

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

    @Prop({default: []})
    listUser: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

