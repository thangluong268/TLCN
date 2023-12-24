import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RoleName {
  USER = 'User',
  SELLER = 'Seller',
  ADMIN = 'Admin',
  MANAGER_USER = 'Manager_User',
  MANAGER_PRODUCT = 'Manager_Product',
  MANAGER_STORE = 'Manager_Store',
}

@Schema({
  timestamps: true,
})
export class Role extends Document {
  @Prop({ type: String })
  name: RoleName;

  @Prop({ type: [String], default: [] })
  listUser: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
