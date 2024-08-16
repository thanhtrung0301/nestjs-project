import { Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/entities/role.entity';
import { RolesRepositoryInterface } from './interfaces/roles.interface';
import { BaseServiceAbstract } from '@modules/services/base/base.abstract.service';

@Injectable()
export class RolesService extends BaseServiceAbstract<Role> {
	constructor(
		@Inject('RolesRepositoryInterface')
		private readonly roles_repository: RolesRepositoryInterface,
	) {
		super(roles_repository);
	}
}