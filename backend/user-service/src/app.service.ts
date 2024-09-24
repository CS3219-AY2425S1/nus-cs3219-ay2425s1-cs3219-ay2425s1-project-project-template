import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password } = data;

    const existingUser = await this.userModel.findOne( { email }).exec();
    if (existingUser) {
      throw new RpcException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    })

    const savedUser = await newUser.save();
    savedUser.password = undefined;
    
    return savedUser;
  }
}
