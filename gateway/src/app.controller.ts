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
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TokenGuard } from './guards/token.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    this.appService.login(loginDto);
  }

  @Post('auth/register')
  register(@Body() registerDto: RegisterDto) {
    this.appService.register(registerDto);
  }

  @UseGuards(TokenGuard)
  @Get('user')
  getAll(@Request() req) {
    this.appService.getAllUser(req.token);
  }

  @UseGuards(TokenGuard)
  @Get('user/profile')
  async getProfile(@Request() req) {
    this.appService.getUserProfile(req.token);
  }

  @UseGuards(TokenGuard)
  @Patch('user/profile')
  async updateProfile(@Request() req, @Body() body) {
    return this.appService.updateUserProfile(req.token, body);
  }

  @UseGuards(TokenGuard)
  @Delete('user/:id')
  async deleteOne(@Request() req, @Param() params) {
    return this.appService.deleteOneUser(req.token, params?.id);
  }

  @EventPattern({ cmd: 'response' })
  async responseClient(@Payload() data) {
    console.log('Received response from microservice:', data);
    return data;
  }
}
