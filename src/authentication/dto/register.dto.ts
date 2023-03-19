import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
