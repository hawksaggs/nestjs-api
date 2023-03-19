import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthGuard } from './localAuth.guard';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthGuard from './jwtAuth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @HttpCode(200)
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtToken(user?.id);
    res.setHeader('Set-Cookie', cookie);
    user.password = undefined;

    return res.send(user);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
    const cookie = this.authService.getCookieForLogOut();
    res.setHeader('Set-Cookie', cookie);

    return res.sendStatus(HttpStatus.OK);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() req: RequestWithUser) {
    const { user } = req;
    if (!user)
      throw new HttpException('User not authenticated', HttpStatus.FORBIDDEN);
    user.password = undefined;

    return user;
  }
}
