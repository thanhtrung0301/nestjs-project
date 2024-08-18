import { Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/entities/role.entity';
import { RolesRepositoryInterface } from './interfaces/roles.interface';
import { BaseServiceAbstract } from '@modules/services/base/base.abstract.service';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class RolesService extends BaseServiceAbstract<Role> {
	constructor(
		@Inject('RolesRepositoryInterface')
		private readonly roles_repository: RolesRepositoryInterface,
	) {
		super(roles_repository);
	}

	@MessagePattern({ cmd: 'get_role' })
	async getRole(role_name: string): Promise<Role> {
	  return await this.findOneByCondition({ name: role_name });
	}
  
	@MessagePattern({ cmd: 'get_role_by_id' })
	async getRoleById(role_id: string): Promise<Role> {
	  return await this.findOne(role_id);
	}
  
	@MessagePattern({ cmd: 'create_role' })
	async createRole(role_data: { name: string }): Promise<Role> {
	  return await this.create(role_data);
	}
}