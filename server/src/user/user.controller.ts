import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityCrudController } from 'src/utils/crud.controller';
import { AdminGuard } from '../shared/admin.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('api/v1/users/')
@UseGuards(AuthGuard(), AdminGuard)
export class UserController extends EntityCrudController<User> {
  constructor(public service: UserService) {
    super(service);
  }
}
