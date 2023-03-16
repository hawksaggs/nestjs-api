import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private UserModel: typeof User,
  ) {}

  async findByEmail(email: string) {
    const user = await this.UserModel.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    const newUser = await this.UserModel.create({ ...data });
    
    return newUser.save();
  }
}
