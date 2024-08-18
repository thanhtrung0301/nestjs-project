import { Controller } from '@nestjs/common';
import { RolesService } from './roles.service';
import { MessagePattern } from '@nestjs/microservices';
import { Role } from 'src/entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly roles_service: RolesService) {}

  @MessagePattern({ cmd: 'get_role' })
	async getRole(role_name: string): Promise<Role> {
	  console.log("🚀 ~ RolesService ~ getRole ~ role_name:", role_name)
	  return await this.roles_service.findOneByCondition({ name: role_name });
	}
  
	@MessagePattern({ cmd: 'get_role_by_id' })
	async getRoleById(role_id: string): Promise<Role> {
	  return await this.roles_service.findOne(role_id);
	}
  
	@MessagePattern({ cmd: 'create_role' })
	async createRole(role_data: { name: string }): Promise<Role> {
	  return await this.roles_service.create(role_data);
	}
}
