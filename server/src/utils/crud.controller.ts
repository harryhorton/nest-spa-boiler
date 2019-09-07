import { EntityService } from './entity.service';
import { Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';

export class EntityCrudController<T extends {}> {
  constructor(public service: EntityService<T>) {}

  @Post('')
  async baseCreate(@Body() options: T) {
    return await this.service.baseCreate(options);
  }

  @Get('')
  async baseFind(@Body() options: T) {
    return await this.service.baseFind(options);
  }

  @Get(':id')
  async baseFindOne(@Param('id') id) {
    return await this.service.baseFindOne({ where: { id } });
  }

  @Patch(':id')
  async baseUpdate(@Param('id') id, @Body() options: T) {
    return await this.service.baseUpdate(id, options);
  }

  @Delete(':id')
  async baseDelete(@Param('id') id) {
    return await this.service.baseDelete(id);
  }
}
