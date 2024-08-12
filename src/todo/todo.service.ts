import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoRepository } from './repo/todo.repository';
import { Todo } from './entities/todo.entity';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/entities/user.entity';
import { Constants } from 'src/utils/constants';
import { UpdateTodoDto } from './dto/update-todo.dto';

// ADD TODO BASED ON USER ID
// FIND ALL TODOS BASED ON USER ID (NOT COMPLETED)
// FIND ALL COMPLETED TODOS BASED ON USER ID (COMPLETED)
// MARK TODO AS COMPLETED BASED ON TODO ID
// DELETE TODO  BASED ON TODO ID

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.description = createTodoDto.description;
    todo.date = new Date();
    todo.user = await this.userService.findUserById(userId);

    await this.emailService.SendTaskCreationEmail(todo.user.email, todo.title);
    this.todoRepository.save(todo);
    return 'Todo Created Successfully';
  }

  findAllTodos(page: Number, limit: Number, status: string | undefined) {
    // userid not completed
    return this.todoRepository.find({
      relations: ['user'],
      take: limit as number,
      skip: ((page as number) - 1) * (limit as number),
      ...(status && { where: { status } }),
    });
  }
  findAllTodosByUser(userId: string) {
    // userid not completed
    return this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }

  update(todoId: number, updateTodoDto: UpdateTodoDto) {
    return this.todoRepository.update(todoId, { ...updateTodoDto });
  }

  async updateTodoAsCompleted(todoId: number, user: User) {
    let admin = await this.userService.findUserByRole(
      Constants.ROLES.ADMIN_ROLE,
    );
    if (admin) {
      this.emailService.SendTaskCompletionEmail(admin.email, todoId.toString());
    }

    return this.todoRepository.update(
      {
        id: todoId,
        user,
      },
      { status: 'completed' },
    );
  }

  remove(todoId: number) {
    return this.todoRepository.delete(todoId);
  }
}
