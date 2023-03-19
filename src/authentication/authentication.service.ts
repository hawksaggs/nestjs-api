import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import RegisterDto from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
