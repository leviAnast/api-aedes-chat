import { Module } from '@nestjs/common';
import {UserController } from './user.controller';
import { UserService } from './user.service';


@Module({//copiado la do app.modules
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}