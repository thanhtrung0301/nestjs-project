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

  async login(loginDto: LoginDto) {
    console.log('🚀 ~ AppService ~ login ~ loginDto:', loginDto);
    return this.auth_service.send({ cmd: 'login' }, loginDto);
  }

  async register(registerDto: RegisterDto) {
    return this.auth_service.send({ cmd: 'register' }, registerDto);
  }

  async getUserProfile(token: string) {
    return this.user_service.send({ cmd: 'get_profile' }, { token });
  }

  async getAllUser(token: string) {
    return this.user_service.send({ cmd: 'get_all' }, { token });
  }

  async updateUserProfile(token: string, body) {
    return this.user_service.send({ cmd: 'update_profile' }, { token, body });
  }

  async deleteOneUser(token: string, params) {
    return this.user_service.send({ cmd: 'delete_user' }, { token, params });
  }
}
