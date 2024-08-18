import {
	IsOptional,
	MaxLength,
} from 'class-validator';

export class UpdateUserDto {
	@IsOptional() // Bắt buộc phải gửi lên
	@MaxLength(50) // Tối đa 50 ký tự
	full_name: string;
}
