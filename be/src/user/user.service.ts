import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { NotFoundExceptionCustom } from 'src/exceptions/NotFoundExceptionCustom.exception';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';
import { UserWithoutPassDto } from './dto/user-without-pass.dto';
import FreedomCustom from 'src/exceptions/FreedomCustom.exception';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly freedomCustom: FreedomCustom
  ) { }

  async create(signUpDto: SignUpDto): Promise<UserWithoutPassDto> {
    try {
      const newUser = await this.userModel.create(signUpDto)
      const userDoc = newUser['_doc']
      const { password, ...userWithoutPass } = userDoc
      return userWithoutPass
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }

  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email })
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      return user
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

<<<<<<< HEAD
  // async getById(userId: Types.ObjectId): Promise<User> {
  //   try {
  //     const user = await this.userModel.findById(userId)
  //     if (!user) { throw new NotFoundExceptionCustom(User.name) }
  //     return user
  //   }
  //   catch (err) {
  //     if (err instanceof MongooseError)
  //       throw new InternalServerErrorExceptionCustom()
  //     throw err
  //   }
  // }
=======
>>>>>>> 98c465016add8743edb49e9db73ebd1626228285
  async getById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      return user
    }
    catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }


  async update(userId: string, req: any): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, req)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async delete(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete(userId)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async addFriend(userId: string, friendId: string): Promise<User> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      const friends = user.friends
      if (friends.includes(friendId.toString())) { throw this.freedomCustom.FriendAlreadyExist() }
      friends.push(friendId.toString())
      user.friends = friends
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async unFriend(userId: string, friendId: string): Promise<User> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      const friends = user.friends
      if (!friends.includes(friendId.toString())) { throw this.freedomCustom.FriendNotExist() }
      const index = friends.indexOf(friendId.toString())
      friends.splice(index, 1)
      user.friends = friends
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async followStore(userId: string, storeId: string): Promise<User> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      const stores = user.followStores
      if (stores.includes(storeId.toString())) { throw this.freedomCustom.FollowedStore() }
      stores.push(storeId.toString())
      user.followStores = stores
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async unFollowStore(userId: string, storeId: string): Promise<User> {
    try {
      // Get friends 
      const user = await this.userModel.findById(userId)
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      const stores = user.followStores
      if (!stores.includes(storeId.toString())) { throw this.freedomCustom.NotFollowStore() }
      const index = stores.indexOf(storeId.toString())
      stores.splice(index, 1)
      user.followStores = stores
      await user.save()
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }
  }

  async plusWarningCount(userId: Types.ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userId, { $inc: { warningCount: 1 } })
      if (!user) { throw new NotFoundExceptionCustom(User.name) }
      return user
    } catch (err) {
      if (err instanceof MongooseError)
        throw new InternalServerErrorExceptionCustom()
      throw err
    }

  }
}