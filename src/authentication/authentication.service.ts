import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const newUser = await this.userService.createUser({
        ...data,
        password: hashedPassword,
      });
      newUser.password = undefined;
      return newUser;
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findUser(email: string, plainPassword: string) {
    try {
      const user = await this.userService.findByEmail(email);
      await this.verifyPassword(plainPassword, user.password);
      user.password = undefined;

      return user;
    } catch (e) {
      throw new HttpException('Bad Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isPasswordMatched = await bcrypt.compare(
      plainPassword,
      hashedPassword,
    );
    if (!isPasswordMatched) {
      throw new HttpException(
        'Password does not match',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
