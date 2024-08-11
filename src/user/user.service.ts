import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repo/user.repository';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    let user: User = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.userName;
    user.password = createUserDto.password;
    user.role = Constants.ROLES.NORMAL_ROLE;
    return this.userRepository.save(user);
  }

  findUserById(id: number) {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  remove(id: number) {
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
