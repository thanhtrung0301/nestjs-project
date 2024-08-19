import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	MaxLength,
} from 'class-validator';
import { USER_ROLE } from 'src/entities/role.entity';

export class CreateRoleDto {
	@IsEnum(USER_ROLE)
	name: string;

	@IsOptional()
	description: string; 
}
