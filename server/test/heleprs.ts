import * as request from 'supertest';
import { User } from '../src/user/user.entity';
import { UserRole } from '../src/user/user.roles';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';

export const login = async (
  app: INestApplication,
  user: Partial<User> = {},
) => {
  const newUser = {
    name: 'john',
    email: 'test@email.com',
    password: 'password',
    role: UserRole.user,
    ...user,
  };
  const userService = app.get<UserService>(UserService);
  const savedUser = await userService.baseCreate(newUser);

  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .expect(201)
    .send({ email: newUser.email, password: newUser.password });
  return { user: savedUser, token: `Bearer ${response.body.access_token}` };
};
