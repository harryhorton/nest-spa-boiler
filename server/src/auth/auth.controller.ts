import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginPayload, RegisterPayload } from './auth.dtos';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/user.roles';

@Controller('api/v1/auth')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterPayload) {
    const existingUser = await this.userService.findOne({
      where: { email: payload.email },
    });
    if (existingUser)
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    const newUser = {
      ...payload,
      role: UserRole.user,
    };
    const user = await this.userService.create(newUser);

    if (!user)
      throw new HttpException(
        'Unable to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body() payload: LoginPayload) {
    const user = await this.authService.validateUser(payload);
    if (!user)
      throw new HttpException(
        'Username or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    return this.authService.login(user);
  }

  @Get('current-user')
  @UseGuards(AuthGuard())
  async currentUser(@Req() req) {
    const user = req.user;

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
