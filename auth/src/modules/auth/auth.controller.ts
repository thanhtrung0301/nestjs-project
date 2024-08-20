import { Body, Controller, Get, Post, Logger, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  @MessagePattern({ cmd: 'register' })
	async registerAccount(@Body() register_dto: RegisterDto) {
    return await this.auth_service.register(register_dto)
	}

  @MessagePattern({ cmd: 'login' })
	async loginAccount(@Body() login_dto: LoginDto) {
    console.log("🚀 ~ AuthController ~ loginAccount ~ login_dto:", login_dto)
    return await this.auth_service.login(login_dto)
	}

}
