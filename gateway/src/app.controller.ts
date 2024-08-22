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
import { WebSocket } from 'ws'; // Import WebSocket
import { EventsGateway } from './events/events.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private eventsGateway: EventsGateway,
  ) {}

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

    this.appService.getAllUser({ token: req.token, reqid });
  }

  @UseGuards(TokenGuard)
  @Get('user/profile')
  async getProfile(@Response() res, @Request() req) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.getUserProfile({ token: req.token, reqid });
  }

  @UseGuards(TokenGuard)
  @Patch('user/profile')
  async updateProfile(@Response() res, @Request() req, @Body() body) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.updateUserProfile({ token: req.token, reqid, body });
  }

  @UseGuards(TokenGuard)
  @Delete('user/:id')
  async deleteOne(@Response() res, @Request() req, @Param() params) {
    const reqid = Date.now();
    this.connection[reqid] = res;

    this.appService.deleteOneUser({
      token: req.token,
      reqid,
      params: params?.id,
    });
  }

  @EventPattern({ cmd: 'response' })
  async responseClient(@Payload() data) {
    console.log('🚀 ~ AppController ~ responseClient ~ data:', data);
    const { client_id, reqid, ...responseData } = data;

    if (client_id) {
      this.eventsGateway.sendToClient(client_id, responseData);
    } else {
      const res = this.connection[reqid];

      if (res) {
        const statusCode: number = responseData?.status || 200;
        res.status(statusCode).json(responseData);

        delete this.connection[reqid];
      } else {
        console.error(`No connection found for reqid: ${reqid}`);
      }
    }
  }
}
