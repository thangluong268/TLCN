import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './schema/store.schema';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: Model<Store>,
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
      return await this.storeModel.findById(id);
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

  async updateWarningCount(storeId: string, action: string): Promise<Store> {
    try {
      let point = 1;
      if (action === 'minus') point = -1;
      return await this.storeModel.findByIdAndUpdate(storeId, { $inc: { warningCount: point } });
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
}
