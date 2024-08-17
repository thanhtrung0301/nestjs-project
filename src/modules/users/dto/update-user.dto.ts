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


	@IsOptional()
	// @IsStrongPassword() // Password phải đủ độ mạnh
	password: string;
    
    @IsOptional()
    role: string;
}
