import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, MongooseError } from 'mongoose';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { UserToken } from './schema/usertoken.schema';

@Injectable()
export class UsertokenService {
  constructor(
    @InjectModel(UserToken.name)
    private readonly userTokenModel: Model<UserToken>,
  ) {}

  async hashData(data: string): Promise<string> {
    const saltOrRounds = Number(process.env.SALT_ROUNDS);
    return await bcrypt.hash(data, saltOrRounds);
  }

  async createUserToken(userId: string, refreshToken: string): Promise<UserToken> {
    const hashedRT = await this.hashData(refreshToken);
    try {
      const userToken = await this.userTokenModel.create({
        userId,
        hashedRefreshToken: hashedRT,
      });
      return userToken;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updateUserToken(userId: string, refreshToken: string): Promise<boolean> {
    try {
      const hashedRT = await this.hashData(refreshToken);
      const userToken = await this.userTokenModel.findOneAndUpdate({ userId }, { hashedRefreshToken: hashedRT }, { new: true });
      if (!userToken) {
        return false;
      }
      return true;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async deleteUserToken(userId: string): Promise<boolean> {
    try {
      const userToken = await this.userTokenModel.findOneAndDelete({ userId });
      if (!userToken) {
        return false;
      }
      return true;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUserTokenById(userId: string): Promise<any> {
    try {
      const userToken = await this.userTokenModel.findOne({ userId });
      return userToken;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
