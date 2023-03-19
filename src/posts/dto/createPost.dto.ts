import { IsNotEmpty, IsString } from 'class-validator';

export default class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
