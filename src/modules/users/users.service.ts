import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UsersRepositoryInterface } from './interfaces/users.interface';
import { BaseServiceAbstract } from '@modules/services/base/base.abstract.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '@modules/roles/roles.service';
import { Role, USER_ROLE } from 'src/entities/role.entity';
import { FindAllResponse } from 'src/types/common.type';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly users_repository: UsersRepositoryInterface,
    private readonly roles_service: RolesService,
  ) {
    super(users_repository);
  }

  async create(create_dto: CreateUserDto): Promise<User> {
    let user_role = await this.roles_service.findOneByCondition({
      name: create_dto.role,
    });
    if (!user_role) {
      user_role = await this.roles_service.create({
        name: create_dto.role,
      });
    }
    const user = await this.users_repository.create({
      ...create_dto,
      role: user_role._id,
    });
    return user;
  }

  async getProfile(user_id: string): Promise<User> {
    const user = this.users_repository.findOneById(user_id, {
      path: 'role',
      transform: (role: Role) => role?.name,
    });
    return user;
  }

  async updateProfile(user_id: string, update_dto: UpdateUserDto) {
    let toUpdate = await this.users_repository.findOneById(user_id);
    delete toUpdate.password;

    let updated = Object.assign(toUpdate, update_dto);
    return await this.users_repository.update(user_id, updated);
  }

  async deleteOne(user_id: string) {
    await this.users_repository.permanentlyDelete(user_id);

    return {
      status: HttpStatus.OK,
      message: 'Deleted successfully !',
    };
  }

  async getAll(): Promise<FindAllResponse<User>> {
    const users = this.users_repository.findAll(
      {},
      {},
      {
        path: 'role',
        transform: (role: Role) => role?.name,
      },
    );
    return users;
  }
}
