import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import PostController from './post.controller';
import { Post } from './post.model';
import PostService from './post.service';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
