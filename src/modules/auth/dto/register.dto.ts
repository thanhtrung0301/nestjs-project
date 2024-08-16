import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
	MaxLength,
} from 'class-validator';
import { USER_ROLE } from 'src/entities/role.entity';

export class RegisterDto {
	@IsNotEmpty() // Bắt buộc phải gửi lên
	@MaxLength(50) // Tối đa 50 ký tự
	full_name: string;

	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail() // Phải là định dạng email
	email: string;

	@IsNotEmpty()
	// @IsStrongPassword() // Password phải đủ độ mạnh
	password: string;
    
    @IsOptional()
    @IsEnum(USER_ROLE)
    role: string;
}
