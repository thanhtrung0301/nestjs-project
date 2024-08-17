import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
	MaxLength,
} from 'class-validator';
import { USER_ROLE } from 'src/entities/role.entity';

export class UpdateUserDto {
	@IsOptional() // Bắt buộc phải gửi lên
	@MaxLength(50) // Tối đa 50 ký tự
	full_name: string;
}
