import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
  @IsString()
  @IsNotEmpty()
  name: string;
}
