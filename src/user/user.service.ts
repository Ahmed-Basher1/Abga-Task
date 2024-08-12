import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repo/user.repository';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    let checkUser = this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (checkUser) {
      throw new BadRequestException('User Already Exists');
    }
    let checkUsername = this.userRepository.findOne({
      where: { username: createUserDto.userName },
    });
    if (checkUsername) {
      throw new BadRequestException('Username Already Exists');
    }

    let user: User = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.userName;
    user.password = createUserDto.password;
    user.role = Constants.ROLES.NORMAL_ROLE;
    return this.userRepository.save(user);
  }

  findUserById(id: string) {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }
  findUserByRole(role: string) {
    return this.userRepository.findOne({ where: { role: role } });
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    let user: User = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }
    let comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Password');
    }
    user.password = newPassword;
    return 'Password Changed Successfully';
  }
}
