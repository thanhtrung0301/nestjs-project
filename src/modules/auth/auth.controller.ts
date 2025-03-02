import { Body, Controller, Get, Post, Logger, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  @Post('register')
	async registerAccount(@Body() register_dto: RegisterDto) {
    return await this.auth_service.register(register_dto)
	}


  @Post('login')
	async loginAccount(@Body() login_dto: LoginDto) {
    return await this.auth_service.login(login_dto)
	}

}
