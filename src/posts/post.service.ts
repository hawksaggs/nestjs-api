import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { Post } from './post.model';

@Injectable()
export default class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {}

  /**
   * Get All Posts
   * @returns
   */
  getAllPosts() {
    return this.postModel.findAll();
  }

  /**
   * Get Post By Id
   * @param id
   * @returns
   */
  async getPostById(id: number) {
    const post = await this.postModel.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  /**
   * Create Post
   * @param post
   * @returns
   */
  async createPost(post: CreatePostDto) {
    const newPost = await this.postModel.create({ ...post });

    return newPost.save();
  }

  /**
   * Update Post
   * @param id
   * @param post
   * @returns
   */
  async updatePost(id: number, post: UpdatePostDto) {
    let postData = await this.postModel.findOne({ where: { id } });
    if (!postData) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    postData.title = post.title;
    postData.content = post.content;

    return await postData.save();
  }

  /**
   * Delete Post
   * @param id
   */
  async deletePost(id: number) {
    const rowAffected = await this.postModel.destroy({ where: { id } });
    if (!rowAffected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
