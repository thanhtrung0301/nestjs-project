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
  Response,
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

  connection: any = {};

  @Post('auth/login')
  login(@Response() res, @Body() loginDto: LoginDto) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.login({ ...loginDto, reqid } as any);
  }

  @Post('auth/register')
  register(@Response() res, @Body() registerDto: RegisterDto) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.register({ ...registerDto, reqid } as any);
  }

  @UseGuards(TokenGuard)
  @Get('user')
  getAll(@Response() res, @Request() req) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.getAllUser(req.token);
  }

  @UseGuards(TokenGuard)
  @Get('user/profile')
  async getProfile(@Response() res, @Request() req) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.getUserProfile(req.token);
  }

  @UseGuards(TokenGuard)
  @Patch('user/profile')
  async updateProfile(@Response() res, @Request() req, @Body() body) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    return this.appService.updateUserProfile(req.token, body);
  }

  @UseGuards(TokenGuard)
  @Delete('user/:id')
  async deleteOne(@Response() res, @Request() req, @Param() params) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    return this.appService.deleteOneUser(req.token, params?.id);
  }

  @EventPattern({ cmd: 'response' })
  async responseClient(@Payload() data) {
    console.log('🚀 ~ AppController ~ responseClient ~ data:', data);
    const { reqid, ...responseData } = data;

    // Retrieve the response object from the connection map
    const res = this.connection[reqid];

    if (res) {
      // Send the response back to the client
      res.status(responseData?.status).json(responseData);

      // Clean up: remove the connection from the map
      delete this.connection[reqid];
    } else {
      console.error(`No connection found for reqid: ${reqid}`);
    }
  }
}
