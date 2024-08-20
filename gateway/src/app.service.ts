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
    this.auth_service.emit({ cmd: 'login' }, loginDto);
  }

  register(registerDto: RegisterDto) {
    this.auth_service.emit({ cmd: 'register' }, registerDto);
  }

  getUserProfile(data: { token: string; reqid: number }) {
    this.user_service.emit({ cmd: 'get_profile' }, data);
  }

  getAllUser(data: { token: string; reqid: number }) {
    this.user_service.emit({ cmd: 'get_all' }, data);
  }

  updateUserProfile(data: { token: string; reqid: number; body: any }) {
    this.user_service.emit({ cmd: 'update_profile' }, data);
  }

  deleteOneUser(data: { token: string; reqid: number; params: any }) {
    this.user_service.emit({ cmd: 'delete_user' }, data);
  }
}
