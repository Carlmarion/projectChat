import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  //localhost:3000/auth/login
  @Post('login')
  async login(@Body() authBody: LogUserDto) {
    console.log(authBody);
    return await this.authService.login({ authBody });
  }

  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    console.log(registerBody);
    return await this.authService.register({ registerBody });
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAuthenticatedUser(@Req() request: RequestWithUser) {
    console.log({ requestLog: request.user });
    return await this.userService.getUser({
      userId: request.user.userId,
    });
  }
}
