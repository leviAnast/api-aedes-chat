import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import {Pool} from 'pg'
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private pool: Pool;

  constructor(){
    this.pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'l3v11234',
      database: 'forum_db'
    }
    );
  }

  async create(createPostDto: CreatePostDto): Promise<Post> { //Cria posts -> os insere no BD
    const bd = await this.pool.connect();
    try{
      const postCriado = await bd.query(`
        INSERT INTO posts (user_id, content, parent_post_id) 
        VALUES ($1, $2, $3)`, [createPostDto.user_id, createPostDto.content, createPostDto.parent_post_id]);
        return postCriado;
    }finally{
      bd.release();
    }
  }

  async getPosts(): Promise<Post[]> { //retorna todos os Posts do BD 
    const bd = await this.pool.connect();
    try{
      const resultado = await bd.query('SELECT * FROM posts ORDER BY date_published DESC');
      return resultado.rows;
    }finally{
      bd.release();
    }
  }

  async getChildren(Postid: number): Promise<Post[]> { //retorna todos os Posts do BD com pai específico
    const bd = await this.pool.connect();

    let resultado
    try{
      if(Postid === 0){
        resultado = await bd.query(
          `SELECT 
              posts.id,
              posts.content,
              posts.date_published,
              posts.parent_post_id,
              users.display_name AS author_name
          FROM 
              posts
          JOIN
              users ON posts.user_id = users.id
          WHERE posts.parent_post_id IS NULL
          ORDER BY posts.date_published DESC`, []);
      }
      else{
        resultado = await bd.query(
          `SELECT 
              posts.id,
              posts.content,
              posts.date_published,
              posts.parent_post_id,
              users.display_name AS author_name
          FROM 
              posts
          JOIN
              users ON posts.user_id = users.id
          WHERE posts.parent_post_id = $1
          ORDER BY posts.date_published DESC`, [Postid]);
      }
      return resultado.rows;
    }finally{
      bd.release();
    }
  }

  async removePosts(Postid: number): Promise<void> { //Remove posts da BD
    const bd = await this.pool.connect();
    try{
      const resultado = await bd.query(`DELETE FROM posts WHERE id = $1`, [Postid]);
    }finally{
      bd.release();
    }
  }
}

