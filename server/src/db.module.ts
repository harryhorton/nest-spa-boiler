import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

export const DbModule = () =>
  TypeOrmModule.forRoot({
    type: 'sqlite',
    name: 'default',
    database: ':memory:',
    synchronize: true,
    entities: [User],
  });
