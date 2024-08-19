import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly auth_service: ClientProxy,
    @Inject('USER_SERVICE') private readonly user_service: ClientProxy,
  ) {}

  login(loginDto: LoginDto) {
    this.auth_service.send({ cmd: 'login' }, loginDto);
  }

  register(registerDto: RegisterDto) {
    this.auth_service.send({ cmd: 'register' }, registerDto);
  }

  getUserProfile(token: string) {
    this.user_service.send({ cmd: 'get_profile' }, { token });
  }

  getAllUser(token: string) {
    this.user_service.send({ cmd: 'get_all' }, { token });
  }

  updateUserProfile(token: string, body) {
    this.user_service.send({ cmd: 'update_profile' }, { token, body });
  }

  deleteOneUser(token: string, params) {
    this.user_service.send({ cmd: 'delete_user' }, { token, params });
  }
}
