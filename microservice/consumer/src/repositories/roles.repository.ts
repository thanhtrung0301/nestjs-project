import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';

import { RolesRepositoryInterface } from '@modules/roles/interfaces/roles.interface';
import { Role, RoleDocument } from 'src/entities/role.entity';

@Injectable()
export class RolesRepository
	extends BaseRepositoryAbstract<RoleDocument>
	implements RolesRepositoryInterface
{
	constructor(
		@InjectModel(Role.name)
		private readonly user_role_model: Model<RoleDocument>,
	) {
		super(user_role_model);
	}
}