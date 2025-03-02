import {
	IsEmail,
	IsNotEmpty,
	MaxLength,
} from 'class-validator';

export class LoginDto {
	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail() // Phải là định dạng email
	email: string;

	@IsNotEmpty()
	// @IsStrongPassword() // Password phải đủ độ mạnh
	password: string;
}
