import { PopulateOptions } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(
    id: string,
    populateOptions?: PopulateOptions | PopulateOptions[],
    projection?: string,
  ): Promise<T>;

  findOneByCondition(
    condition?: object,
    populateOptions?: PopulateOptions | PopulateOptions[],
    projection?: string,
  ): Promise<T>;

  findAll(
    condition: object,
    options?: object,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<T>>;

  update(id: string, dto: Partial<T>): Promise<T>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;
}
