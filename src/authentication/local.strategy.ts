import { PassportStrategy } from '@nestjs/passport/dist';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({ usernameField: 'email' }); // By default, expecting `username` and `password` as fieldName
  }

  async validate(email: string, password: string) {
    return this.authService.findUser(email, password);
  }
}
