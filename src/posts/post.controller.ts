import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common/decorators';
import PostService from './post.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { UseGuards } from '@nestjs/common';
import JwtAuthGuard from '../authentication/jwtAuth.guard';
import FindOneParams from '../utils/findOne.params';

@Controller('posts')
export default class PostController {
  constructor(private readonly postsService: PostService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }
}
