import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class EntityService<Entity extends {}> {
  constructor(public repository: Repository<Entity>) {}

  async baseCreate(fields: DeepPartial<Entity>) {
    const entity = this.repository.create(fields);
    return await this.repository.save(entity, { reload: true });
  }

  async baseFind(options?: FindManyOptions<Entity>) {
    return await this.repository.find(options);
  }

  async baseFindOne(options: FindOneOptions<Entity>) {
    return await this.repository.findOne(options);
  }

  async baseUpdate(
    criteria: FindConditions<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ) {
    await this.repository.update(criteria, partialEntity);
    return await this.baseFindOne(criteria);
  }

  async baseDelete(entity: Entity) {
    await this.repository.remove(entity);
    return entity;
  }
}
