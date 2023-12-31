import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GiveInfo, ProductInfo, ReceiverInfo } from '../dto/create-bill.dto';

export const BILL_STATUS = 'NEW-CONFIRMED-DELIVERING-DELIVERED-CANCELLED-RETURNED';

export const BILL_STATUS_TRANSITION = {
  NEW: 'Đơn mới',
  CONFIRMED: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Đã hoàn',
};

export enum PRODUCT_TYPE {
  SELL = 'SELL',
  GIVE = 'GIVE',
}

export class ContentNotiByStatus {
  private readonly billId: string;
  constructor(billId: string) {
    this.billId = billId;
  }
  get CONFIRMED(): string {
    return `Đơn hàng #${this.billId} đang được chuẩn bị.`;
  }
  get DELIVERING(): string {
    return `Đơn hàng #${this.billId} đang được giao.`;
  }
  get DELIVERED(): string {
    return `Đơn hàng #${this.billId} đã được giao.`;
  }
  get CANCELLED(): string {
    return `Đơn hàng #${this.billId} đã bị hủy.`;
  }
}

@Schema({
  timestamps: true,
})
export class Bill extends Document {
  @Prop()
  userId: string;

  @Prop()
  storeId: string;

  @Prop({ type: [Object] })
  listProducts: ProductInfo[];

  @Prop()
  notes: string;

  @Prop()
  totalPrice: number;

  @Prop()
  deliveryMethod: string;

  @Prop()
  paymentMethod: string;

  @Prop({ type: Object })
  receiverInfo: ReceiverInfo;

  @Prop({ type: Object || null })
  giveInfo: GiveInfo | null;

  @Prop()
  deliveryFee: number;

  @Prop({ default: 'NEW' })
  status: string;

  @Prop()
  isPaid: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
