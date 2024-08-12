import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { signUpAdminDto } from './dto/signupAdmin.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private AuthService: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    //   jwt token
    const user: User = await this.AuthService.login(
      loginDto.email,
      loginDto.password,
    );
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return { token: this.jwtService.sign(payload) };
  }

  @Post('/admin')
  async signup(@Body() signUpAdminDto: signUpAdminDto) {
    let user = await this.AuthService.signup(signUpAdminDto);
    let payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return { token: this.jwtService.sign(payload) };
  }

  @Post('/forgetPassword')
  async forgetPassword(@Body('email') email: string) {
    return this.AuthService.forgetPassword(email);
  }
}
