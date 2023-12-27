import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, MongooseError } from 'mongoose';
import { LoginSocialDto } from 'src/auth/dto/login-social.dto';
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

  async createNormal(signUpDto: SignUpDto): Promise<UserWithoutPassDto> {
    try {
      const newUser = await this.userModel.create(signUpDto);
      newUser.avatar = 'https://res.cloudinary.com/dl3b2j3td/image/upload/v1702564956/TLCN/ov6t50kl5npfmwfopzrk.png';
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

  async createSocial(loginSocialDto: LoginSocialDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(loginSocialDto);
      newUser.isSocial = true;
      await newUser.save();
      return newUser;
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

  async getByEmailAndSocial(email: string, isSocial: boolean): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email, isSocial });

      user?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));

      return user;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async compareData(data: string, hashedData: string): Promise<boolean> {
    const isMatched = await bcrypt.compare(data, hashedData);
    return isMatched;
  }

  async getByEmailPasswordAndSocial(email: string, passwordInput: string, isSocial: boolean): Promise<User> {
    try {
      const users: User[] = await this.userModel.find({ email, isSocial });

      let userMatch: User;

      for (const user of users) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
        let userDoc = user['_doc'] ? user['_doc'] : user;
        // eslint-disable-next-line prefer-const
        let isMatch = await this.compareData(passwordInput, userDoc.password);
        if (userDoc.email === email && isMatch && userDoc.isSocial === isSocial) {
          userMatch = userDoc;
        }
      }

      userMatch?.address.sort((a, b) => (b.default ? 1 : -1) - (a.default ? 1 : -1));

      return userMatch;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);

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

  async followStore(id: string, storeId: string): Promise<void> {
    try {
      let user: User = await this.userModel.findById(id);

      user = user['_doc'] ? user['_doc'] : user;

      const index = user.followStores.findIndex(id => id.toString() === storeId.toString());

      index == -1 ? user.followStores.push(storeId) : user.followStores.splice(index, 1);

      await this.userModel.findByIdAndUpdate(id, { followStores: user.followStores });
      return;
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async addFriend(id: string, userIdReceive: string): Promise<void> {
    try {
      let user: User = await this.userModel.findById(id);

      user = user['_doc'] ? user['_doc'] : user;

      const index = user.friends.findIndex(id => id.toString() === userIdReceive.toString());

      index == -1 ? user.friends.push(userIdReceive) : user.friends.splice(index, 1);

      await this.userModel.findByIdAndUpdate(id, { friends: user.friends });

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
  async getAll(page: number = 1, limit: number = 5, search: string): Promise<{ total: number; users: User[] }> {
    try {
      const skip = (Number(page) - 1) * Number(limit);
      const query = search
        ? {
            $or: [
              { fullName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const total = await this.userModel.countDocuments(query);

      const users = await this.userModel.find(query).sort({ createdAt: -1 }).limit(Number(limit)).skip(skip);

      users.forEach(user => {
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

  async countTotal(): Promise<number> {
    try {
      return await this.userModel.countDocuments();
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getAllNoPaging(): Promise<User[]> {
    try {
      return await this.userModel.find();
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }

  async getFollowStoresByUserId(page: number = 1, limit: number = 5, userId: string): Promise<{ total: number; data: string[] }> {
    try {
      const user: User = await this.getById(userId);
      user.followStores.reverse();

      const storeIds: string[] = user.followStores.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
      const total: number = user.followStores.length;

      return { total, data: storeIds };
    } catch (err) {
      if (err instanceof MongooseError) throw new InternalServerErrorExceptionCustom();
      throw err;
    }
  }
}
