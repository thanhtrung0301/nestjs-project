import { FilterQuery, Model, PopulateOptions, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';
import { BaseEntity } from 'src/modules/shared/base/base.entity';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create(dto);
    return created_data.save();
  }

  async findOneById(
    id: string,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<T> {
    let query = this.model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const item = await query.exec();
    return item && !item.deleted_at ? item : null;
  }

  async findOneByCondition(
    condition = {},
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<T> {
    let query = this.model.findOne({
      ...condition,
      deleted_at: null,
    });
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    return await query.exec();
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
    populateOptions?: PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<T>> {
    let findQuery = this.model.find(
      { ...condition, deleted_at: null },
      options?.projection,
      options,
    );
    if (populateOptions) {
      findQuery = findQuery.populate(populateOptions);
    }

    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...condition, deleted_at: null }),
      findQuery.exec(),
    ]);

    return {
      count,
      items,
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate(
      { _id: id, deleted_at: null },
      dto,
      { new: true },
    );
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { deleted_at: new Date() })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
