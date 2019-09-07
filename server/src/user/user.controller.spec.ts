import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { login } from '../../test/heleprs';
import { createTestingApp } from '../test-app.module';
import { UserRole } from '../user/user.roles';

const sampleUser = {
  name: 'joe',
  email: 'user@email.com',
  password: 'password',
  role: UserRole.user,
};

describe('User Controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });
  afterEach(async () => {
    await app.close();
  });
  it('should not allow non authed users', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(401)
      .send();
    await request(app.getHttpServer())
      .get('/api/v1/users/fake')
      .expect(401)
      .send({ name: 'thename' });

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .expect(401)
      .send({ name: 'changedname' });

    await request(app.getHttpServer())
      .patch('/api/v1/users/fakeid')
      .expect(401)
      .send({ name: 'changedname' });

    await request(app.getHttpServer())
      .delete('/api/v1/users/fakeid')
      .expect(401)
      .send();
  });

  it('should not allow non-admin to modify', async () => {
    const { token } = await login(app);

    await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('authorization', token)
      .expect(403)
      .send();
    await request(app.getHttpServer())
      .get('/api/v1/users/fake')
      .set('authorization', token)
      .expect(403)
      .send();

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('authorization', token)
      .expect(403)
      .send();

    await request(app.getHttpServer())
      .patch('/api/v1/users/fakeid')
      .set('authorization', token)
      .expect(403)
      .send();

    await request(app.getHttpServer())
      .delete('/api/v1/users/fakeid')
      .set('authorization', token)
      .expect(403)
      .send();
  });

  it('should allow admin to create', async () => {
    const { token } = await login(app, { role: UserRole.admin });
    const response = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('authorization', token)
      .expect(201)
      .send({ ...sampleUser });
  });

  it('should allow admin to read users', async () => {
    const { token } = await login(app, { role: UserRole.admin });
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('authorization', token)
      .expect(201)
      .send({ ...sampleUser });

    const response = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('authorization', token)
      .expect(200)
      .send();
    expect(response.body[1].id).toBe(createResponse.body.id);
  });

  it('should allow admin to update users', async () => {
    const { token } = await login(app, { role: UserRole.admin });
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('authorization', token)
      .expect(201)
      .send({ ...sampleUser });

    await request(app.getHttpServer())
      .patch(`/api/v1/users/${createResponse.body.id}`)
      .set('authorization', token)
      .expect(200)
      .send({ name: 'new name' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('authorization', token)
      .expect(200)
      .send();

    expect(response.body[1].name).toBe('new name');
  });

  it('should allow admin to delete users', async () => {
    const { token } = await login(app, { role: UserRole.admin });
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('authorization', token)
      .expect(201)
      .send({ ...sampleUser });

    await request(app.getHttpServer())
      .delete(`/api/v1/users/${createResponse.body.id}`)
      .set('authorization', token)
      .expect(200)
      .send();

    const response = await request(app.getHttpServer())
      .get(`/api/v1/users/${createResponse.body.id}`)
      .set('authorization', token)
      .expect(404)
      .send();
  });
});
