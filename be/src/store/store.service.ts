import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schema/store.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name)
        private readonly storeModel: Model<Store>
    ) { }

    async create(userId: string, phone: string, store: CreateStoreDto): Promise<Store> {
        try {
            const newStore = await this.storeModel.create(store)
            newStore.userId = userId
            newStore.phone = phone
            await newStore.save()
            return newStore
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getById(id: string): Promise<Store> {
        try {
            const store = await this.storeModel.findById(id)
            if (!store) { throw new NotFoundExceptionCustom(Store.name) }
            return store
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByUserId(userId: string): Promise<Store> {
        try {
            const store = await this.storeModel.findOne({ userId })
            if (!store) { throw new NotFoundExceptionCustom(Store.name) }
            return store
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

}
