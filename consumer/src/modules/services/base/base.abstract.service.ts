import { FilterQuery, QueryOptions, PopulateOptions } from 'mongoose';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { FindAllResponse } from 'src/types/common.type';
import { BaseServiceInterface } from './base.interface.service';
import { BaseRepositoryInterface } from 'src/repositories/base/base.interface.repository';

export abstract class BaseServiceAbstract<T extends BaseEntity>
  implements BaseServiceInterface<T>
{
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(create_dto: T | any): Promise<T> {
    return await this.repository.create(create_dto);
  }

  async findAll(
    filter?: FilterQuery<T>,
    options?: QueryOptions<T>,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, options, populateOptions);
  }

  async findOne(id: string, populateOptions?: PopulateOptions | PopulateOptions[]) {
    return await this.repository.findOneById(id, populateOptions);
  }

  async findOneByCondition(
    condition: FilterQuery<T>, 
    populateOptions?: PopulateOptions | PopulateOptions[], 
    projection?: string
  ) {
    return await this.repository.findOneByCondition(condition, populateOptions, projection);
  }

  async update(id: string, update_dto: Partial<T>) {
    return await this.repository.update(id, update_dto);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }
}
