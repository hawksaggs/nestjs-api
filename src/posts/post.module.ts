import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from 'src/database/database.module';
import PostController from './post.controller';
import { Post } from './post.model';
import { postProviders } from './post.provider';
import PostService from './post.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService, ...postProviders],
})
export class PostModule {}
