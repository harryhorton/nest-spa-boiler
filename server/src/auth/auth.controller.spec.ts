import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { login } from 'test/heleprs';
import { createTestingApp } from '../test-app.module';
import { UserRole } from '../user/user.roles';
import { UserService } from '../user/user.service';

describe('Auth Controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });
  afterEach(async () => {
    await app.close();
  });

  it('should not be able to log in without valid use', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .expect(401)
      .send({ email: 'test@email.com', password: 'password' });
  });

  it('should not be able to log in with bad password', async () => {
    const userService = app.get<UserService>(UserService);
    await userService.baseCreate({
      name: 'john',
      email: 'test@email.com',
      password: 'password',
      role: UserRole.user,
    });

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .expect(401)
      .send({ email: 'test@email.com', password: 'badPassword' });

    console.log(response.body);
  });

  it('should allow login with valid username and password', async () => {
    const userService = app.get<UserService>(UserService);
    await userService.baseCreate({
      name: 'john',
      email: 'test@email.com',
      password: 'password',
      role: UserRole.user,
    });

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .expect(201)
      .send({ email: 'test@email.com', password: 'password' });

    expect(response.body.access_token).toBeDefined();
  });

  it('should allow register and login', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .expect(201)
      .send({ name: 'john', email: 'test@email.com', password: 'password' });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .expect(201)
      .send({ email: 'test@email.com', password: 'password' });

    expect(response.body.access_token).toBeDefined();
    expect(loginResponse.body.access_token).toBeDefined();
  });

  it('should allow user to get instance of itself', async () => {
    const { token, user } = await login(app, {
      name: 'john',
      email: 'test@email.com',
      role: UserRole.user,
    });

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/current-user')
      .set('authorization', token)
      .expect(200)
      .send();

    expect(response.body).toMatchObject({
      id: user.id,
      name: 'john',
      email: 'test@email.com',
      role: UserRole.user,
    });
    expect(response.body.password).toBeUndefined();
  });
});
