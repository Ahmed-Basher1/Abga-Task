import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Constants } from 'src/utils/constants';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TodoData } from './dto/Todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
// @Serialize(TodoData)
@ApiTags('Todo')
@ApiSecurity('JWT-auth')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('admin/create/:userId')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  create(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @Param('userId') userId: string,
  ) {
    return this.todoService.create(createTodoDto, userId);
  }

  @Post('/')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLES.NORMAL_ROLE))
  createTodoByUser(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @Req() req,
  ) {
    let userId = req.user.userId;
    return this.todoService.create(createTodoDto, userId);
  }

  @Get('/admin/findAll')
  findAllTodosByAdmin(
    @Query('status') status: string | undefined,
    @Query('page') page: Number,
    @Query('limit') limit: Number,
  ) {
    return this.todoService.findAllTodos(page, limit, status);
  }

  @Get('/')
  @ApiSecurity('JWT-auth')
  findAllTodosByUser(@Req() req) {
    let userId = req.user.userId;
    return this.todoService.findAllTodosByUser(userId);
  }

  @Put(':id')
  updateTask(
    @Body(ValidationPipe) updateTodoDto: UpdateTodoDto,
    @Param('id') id: Number,
  ) {
    return this.todoService.update(Number(id), updateTodoDto);
  }

  @Patch('/complete/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLES.NORMAL_ROLE))
  updateTodoAsCompleted(@Param('id') id: string, @Req() req) {
    let user = req.user.userId;
    return this.todoService.updateTodoAsCompleted(Number(id), user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(Number(id));
  }
}
