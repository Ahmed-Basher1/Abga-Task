import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserData } from './dto/UserData.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('user')
@ApiTags('User')
@Serialize(UserData)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiSecurity('JWT-auth')
  @Get()
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  findAll(@Req() req) {
    return this.userService.findAll();
  }

  @ApiSecurity('JWT-auth')
  @Delete(':id')
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  remove(@Param('id') id: string, @Req() req) {
    console.log(req.user);
    return this.userService.remove(+id);
  }

  @ApiSecurity('JWT-auth')
  @Put('changePassword')
  changePassword(
    @Req() req,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    let id = req.user.userId;
    return this.userService.changePassword(id, oldPassword, newPassword);
  }

  @ApiSecurity('JWT-auth')
  @Get('profile')
  profile(@Req() req) {
    console.log(req.user);
    return this.userService.findUserById(req.user.userId);
  }
}
