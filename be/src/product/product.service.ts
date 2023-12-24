import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, MongooseError, Types } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import sortByConditions from '../utils/sortByContitions';
import { CreateProductDto } from './dto/create-product.dto';
import { ExcludeIds, FilterDate, FilterProduct } from './dto/product.dto';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(storeId: string, product: CreateProductDto): Promise<Product> {
    try {
      const newProduct = await this.productModel.create(product);
      newProduct.storeId = storeId;
      await newProduct.save();
      return newProduct;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findOne({ _id: id.toString() });
      return product;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAllBySearch(
    storeIdInput: string,
    pageQuery: number = 1,
    limitQuery: number = 5,
    searchQuery: string,
    sortTypeQuery: string = 'desc',
    sortValueQuery: string = 'productName',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: any,
  ): Promise<{ total: number; products: Product[] }> {
    const storeId = storeIdInput ? { storeId: storeIdInput } : {};
    const search = searchQuery
      ? {
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(searchQuery) === true ? searchQuery.toString() : new mongoose.Types.ObjectId() },
            { productName: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { keywords: { $regex: searchQuery, $options: 'i' } },
            { type: { $regex: searchQuery, $options: 'i' } },
            { storeName: { $regex: searchQuery, $options: 'i' } },
            { categoryId: mongoose.Types.ObjectId.isValid(searchQuery) === true ? searchQuery.toString() : new mongoose.Types.ObjectId() },
          ],
        }
      : {};
    const skip = Number(limitQuery) * (Number(pageQuery) - 1);
    try {
      const total = await this.productModel.countDocuments({ ...search, ...storeId, ...status });
      const products = await this.productModel
        .find({ ...search, ...storeId, ...status })
        .sort({ createdAt: -1 })
        .limit(Number(limitQuery))
        .skip(skip);

      sortByConditions(products, sortTypeQuery, sortValueQuery);

      return { total, products };
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAllGive(
    pageQuery: number = 1,
    limitQuery: number = 5,
    sortTypeQuery: string = 'desc',
    sortValueQuery: string = 'productName',
  ): Promise<{ total: number; products: Product[] }> {

    const skip = Number(limitQuery) * (Number(pageQuery) - 1);
    try {
      const total = await this.productModel.countDocuments({ price: 0, status: true });
      const products = await this.productModel
        .find({ price: 0, status: true })
        .sort({ createdAt: -1 })
        .limit(Number(limitQuery))
        .skip(skip);

      sortByConditions(products, sortTypeQuery, sortValueQuery);

      return { total, products };
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, product: any): Promise<Product> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate({ _id: id }, { ...product }, { new: true });
      if (product.quantity === 0) {
        updatedProduct.status = false;
        await updatedProduct.save();
      }
      return updatedProduct;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async deleteProduct(productId: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndDelete(productId);
      return product;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getListProductLasted(limit: number = 5): Promise<Product[]> {
    try {
      const products = await this.productModel.find({ status: true }).sort({ createdAt: -1 }).limit(Number(limit));
      return products;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updateQuantity(id: string, quantitySold: number): Promise<void> {
    try {
      const product: Product = await this.getById(id);
      product.quantity -= quantitySold;
      if (product.quantity === 0) {
        product.status = false;
      }
      await product.save();
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getRandomProducts(limit: number = 5, excludeIdsBody: ExcludeIds, cursor?: FilterDate): Promise<Product[]> {
    try {
      const excludeIds: Types.ObjectId[] = excludeIdsBody.ids.map(id => new Types.ObjectId(id));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = {};

      if (cursor.date) query = { createdAt: { $gt: new Date(cursor.date) } };

      const products: Product[] = await this.productModel.aggregate([
        {
          $match: {
            ...query,
            _id: { $nin: excludeIds },
            status: true,
          },
        },
        { $sample: { size: Number(limit) } },
      ]);

      const remainingLimit: number = limit - products.length;

      if (remainingLimit < limit) {
        const currentExcludeIds: Types.ObjectId[] = products.map(product => product._id);
        excludeIds.push(...currentExcludeIds);

        const otherProducts: Product[] = await this.productModel.aggregate([
          {
            $match: {
              _id: { $nin: excludeIds },
              status: true,
            },
          },
          { $sample: { size: remainingLimit } },
        ]);
        products.push(...otherProducts);
      }

      return products;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAllBySearchAndFilter(
    pageQuery: number = 1,
    limitQuery: number = 5,
    searchQuery: string,
    filterQuery?: FilterProduct,
  ): Promise<{ total: number; products: Product[] }> {
    const limit = Number(limitQuery) || Number(process.env.LIMIT_DEFAULT);
    const page = Number(pageQuery) || Number(process.env.PAGE_DEFAULT);
    const skip = limit * (page - 1);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = {};

      if (searchQuery) {
        query.$or = [
          { productName: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { keywords: { $regex: searchQuery, $options: 'i' } },
          { type: { $regex: searchQuery, $options: 'i' } },
          { storeName: { $regex: searchQuery, $options: 'i' } },
          { categoryId: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      if (filterQuery) {
        query = { ...query, ...this.buildFilterQuery(filterQuery) };
      }

      const total = await this.productModel.countDocuments(query);
      const products = await this.productModel.find(query).sort({ price: 1, quantity: 1, createdAt: -1 }).limit(limit).skip(skip);

      return { total, products };
    } catch (err) {
      if (err instanceof MongooseError) {
        throw new InternalServerErrorExceptionCustom();
      }
      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildFilterQuery(filterQuery: FilterProduct): any {
    const filter = {};

    if (filterQuery.priceMin && filterQuery.priceMax) {
      filter['price'] = { $gte: Number(filterQuery.priceMin), $lte: Number(filterQuery.priceMax) };
    }

    if (filterQuery.quantityMin && filterQuery.quantityMax) {
      filter['quantity'] = { $gte: Number(filterQuery.quantityMin), $lte: Number(filterQuery.quantityMax) };
    }

    if (filterQuery.createdAtMin && filterQuery.createdAtMax) {
      filter['createdAt'] = { $gte: new Date(filterQuery.createdAtMin), $lte: new Date(filterQuery.createdAtMax) };
    }

    return filter;
  }

  async getProductsByStoreId(storeId: string): Promise<Product[]> {
    try {
      const products = await this.productModel.find({ storeId });
      return products;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async deleteProductByCategory(categoryId: string): Promise<void> {
    try {
      await this.productModel.deleteMany({ categoryId });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getListStoreHaveMostProducts(limit: number = 5): Promise<any> {
    try {
      const products = await this.productModel.aggregate([
        {
          $group: {
            _id: '$storeId',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: Number(limit),
        },
      ]);

      return products;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async countTotal(): Promise<number> {
    try {
      const total = await this.productModel.countDocuments();
      return total;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
