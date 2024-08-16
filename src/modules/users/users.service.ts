import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UsersRepositoryInterface } from './interfaces/users.interface';
import { BaseServiceAbstract } from '@modules/services/base/base.abstract.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '@modules/roles/roles.service';
import { USER_ROLE } from 'src/entities/role.entity';

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
}
