import { Injectable, UnauthorizedException } from '@nestjs/common';
import {Pool} from 'pg'
import { User } from './entities/users.entities';
import { createUsuarioDto } from './dto/create-user.dto';

@Injectable()
export class UserService { 

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

  
  async getUsuario(id: Number): Promise<User>{//Retorna apenas um usuário pelo id
    const bd = await this.pool.connect();
    try{
      const resultado = await bd.query('SELECT * FROM users WHERE id = $1', [id]);
      return resultado.rows[0];
    }finally{
      bd.release();
    }
  }

  async login(email: String, password: String): Promise<User>{ //Login -> requisão email e senha
    //< > -> tipo entities
    const bd = await this.pool.connect();
    try{
      const usuarioRequisitado = await bd.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if(usuarioRequisitado.rows.length === 0){
        throw new UnauthorizedException('Login incorreto');
      }
      if(usuarioRequisitado.rows[0].password == password){
        return usuarioRequisitado.rows[0] //primeiro elemento da coluna -> Usuario
      }
    }finally{
      bd.release();
    }
  }

  async criarUsuario(createUserDto: createUsuarioDto): Promise<User>{ //Cadastro de usuário -> INSERT no BD
    const bd = await this.pool.connect();
    try{
      const usuarioCriado = await bd.query(`
          INSERT INTO users 
            (email, password, display_name, user_type) 
          VALUES
            ($1, $2, $3, $4)`, [createUserDto.email, createUserDto.password, createUserDto.display_name, createUserDto.user_type]);
      return usuarioCriado;
    }finally{
      bd.release();
    }
  }

  
}




