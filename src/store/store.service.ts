import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './schema/store.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: Model<Store>,
    private mailService: MailerService,
  ) {}

  async create(userId: string, store: CreateStoreDto): Promise<Store | boolean> {
    try {
      const newStore = await this.storeModel.create(store);
      newStore.userId = userId;
      await newStore.save();
      return newStore;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getById(id: string): Promise<Store> {
    try {
      const store = await this.storeModel.findOne({ _id: id.toString() });
      return store['_doc']
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getByUserId(userId: string): Promise<Store> {
    try {
      return await this.storeModel.findOne({ userId });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async update(userId: string, store: UpdateStoreDto): Promise<Store> {
    try {
      return await this.storeModel.findOneAndUpdate({ userId }, store, { new: true });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updateWarningCount(id: string, warningCount: number, emailSeller: string): Promise<void> {
    try {
      if (warningCount + 1 === 5) {
        await this.storeModel.findOneAndUpdate({ _id: id.toString() }, { warningCount: warningCount + 1, status: false });

        await this.mailService.sendMail({
          to: emailSeller,
          from: process.env.MAIL_USER,
          subject: 'STORE BANNED',
          //Template is handlebar files
          template: './store-banned',
          context: {
            otp: 'Your store has been banned. Please contact the administrator for more information.',
          },
        });
      } else {
        await this.storeModel.findOneAndUpdate({ _id: id.toString() }, { warningCount: warningCount + 1 });
        await this.mailService.sendMail({
          to: emailSeller,
          from: process.env.MAIL_USER,
          subject: 'STORE WARNING',
          //Template is handlebar files
          template: './store-warning',
          context: {
            otp: 'Your store has been warned. Because your product has been reported 5 times.',
          },
        });
      }
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async delete(userId: string): Promise<Store> {
    try {
      return await this.storeModel.findOneAndDelete({ userId });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async countTotal(): Promise<number> {
    try {
      return await this.storeModel.countDocuments();
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAll(page: number = 1, limit: number = 5, search: string): Promise<{ total: number; stores: Store[] }> {
    const skip = Number(limit) * (Number(page) - 1);

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    try {
      const total = await this.storeModel.countDocuments(query);
      const stores = await this.storeModel.find(query).sort({ createdAt: -1 }).limit(Number(limit)).skip(skip);

      return { total, stores };
    } catch (err) {
      if (err instanceof MongooseError) {
        throw new InternalServerErrorExceptionCustom();
      }
      throw err;
    }
  }
}
