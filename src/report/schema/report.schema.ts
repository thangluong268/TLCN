import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Report extends Document {
  @Prop()
  productId: string;

  @Prop()
  userId: string;

  @Prop()
  content: string;

  @Prop()
  status: boolean = false;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
