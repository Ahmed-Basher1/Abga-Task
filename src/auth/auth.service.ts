import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/user/repo/user.repository';
import * as bcrypt from 'bcryptjs';
import { signUpAdminDto } from './dto/signupAdmin.dto';
import { Constants } from 'src/utils/constants';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly EmailService: EmailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async signup(signUpAdminDto: signUpAdminDto) {
    const user = await this.userRepository.findOne({
      where: { email: signUpAdminDto.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.userRepository.create({
      email: signUpAdminDto.email,
      password: signUpAdminDto.password,
      username: signUpAdminDto.username,
      role: Constants.ROLES.ADMIN_ROLE,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async forgetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.EmailService.sendOtpForForgetPassword(email);
    return 'OTP sent successfully';
  }
}
