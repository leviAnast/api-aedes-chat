import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  findChildren(@Param('id') id: string) {
    return this.postsService.getChildren(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.removePosts(+id);
  }
}
