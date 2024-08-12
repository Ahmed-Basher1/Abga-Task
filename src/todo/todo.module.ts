import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoRepository } from './repo/todo.repository';
import { UserModule } from 'src/user/user.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoRepository]), UserModule],
  controllers: [TodoController],
  providers: [TodoService,EmailService],
})
export class TodoModule {}
