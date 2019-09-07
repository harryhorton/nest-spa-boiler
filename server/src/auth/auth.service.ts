import {
  Injectable,
  UseGuards,
  Get,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain } from 'class-transformer';
import { User } from '../user/user.entity';
import { LoginPayload } from './auth.dtos';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginPayload): Promise<any> {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) return null;
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) return user;

    return null;
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
