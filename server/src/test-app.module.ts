import { Test } from '@nestjs/testing';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db.module';
import { UserModule } from './user/user.module';

export const createTestingApp = async () => {
  const module = await Test.createTestingModule({
    imports: [DbModule(), AuthModule, UserModule],
  }).compile();

  const app = module.createNestApplication();

  await app.init();

  return app;
};
