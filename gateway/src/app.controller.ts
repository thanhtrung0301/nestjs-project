import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  @Post('auth/register')
  register(@Body() registerDto: RegisterDto) {
    return this.appService.register(registerDto);
  }

  @Get('user')
  getAll(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];

    return this.appService.getAllUser(token);
  }

  @Get('user/profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];

    return this.appService.getUserProfile(token);
  }

  @Patch('user/profile')
  async updateProfile(@Headers('authorization') authHeader: string, @Body() body) {
    const token = authHeader?.split(' ')[1];

    return this.appService.updateUserProfile(token, body);
  }

  
  @Delete('user/:id')
  async deleteOne(@Headers('authorization') authHeader: string, @Param() params) {
    const token = authHeader?.split(' ')[1];
    return this.appService.deleteOneUser(token, params?.id);
  }
}
