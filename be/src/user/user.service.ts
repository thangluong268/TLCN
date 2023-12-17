import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { SignUpDto } from '../auth/dto/signup.dto';
import { InternalServerErrorExceptionCustom } from '../exceptions/InternalServerErrorExceptionCustom.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithoutPassDto } from './dto/user-without-pass.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(signUpDto: SignUpDto): Promise<UserWithoutPassDto> {
    try {
      const newUser = await this.userModel.create(signUpDto);
      await newUser.save();
      const userDoc = newUser['_doc'];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPass } = userDoc;
      return userWithoutPass;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });

      user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));

      return user;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);

      user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));

      return user;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async update(userId: string, req: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, req, { new: true });

      return user;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async delete(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(userId);
      return user;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async followStore(userId: string, storeId: string): Promise<void> {
    try {
      const user: User = await this.userModel.findById(userId);

      const index = user.followStores.findIndex(id => id.toString() === storeId.toString());

      index == -1 ? user.followStores.push(storeId) : user.followStores.splice(index, 1);

      await user.save();
      return;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async addFriend(userIdSend: string, userIdReceive: string): Promise<void> {
    try {
      const user: User = await this.userModel.findById(userIdSend);

      const index = user.friends.findIndex(id => id.toString() === userIdReceive.toString());

      index == -1 ? user.friends.push(userIdReceive) : user.friends.splice(index, 1);

      await user.save();
      return;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updateWallet(userId: string, money: number, type: string): Promise<boolean> {
    try {
      const user = await this.getById(userId);
      const bonus = (money * 0.2) / 1000;
      const updateUser = new UpdateUserDto();
      updateUser.wallet = type == 'plus' ? user.wallet + bonus : user.wallet - bonus;
      await this.update(userId, updateUser);
      return true;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updateWarningCount(userId: string, action: string): Promise<User> {
    try {
      let point = 1;
      if (action === 'minus') point = -1;
      const user = await this.userModel.findByIdAndUpdate(userId, { $inc: { warningCount: point } });
      return user;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
  // getAll
  async getAll(page: number, limit: number, search: string): Promise<{ total: number; users: User[] }> {
    try {
      // Total user and search user by email or name
      const total = await this.userModel.countDocuments({
        $or: [{ email: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }],
      });
      const users = await this.userModel
        .find({ $or: [{ email: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      users.map(user => {
        user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));
        return user;
      });

      return { total, users };
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async updatePassword(email: string, password: string): Promise<User> {
    try {
      // Update password by email
      return await this.userModel.findOneAndUpdate({ email }, { password });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getFollowStoresByStoreId(storeId: string): Promise<User[]> {
    try {
      return await this.userModel.find({ followStores: storeId });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async countTotalFollowStoresByStoreId(storeId: string): Promise<number> {
    try {
      return await this.userModel.countDocuments({ followStores: storeId });
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
