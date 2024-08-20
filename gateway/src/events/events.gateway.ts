import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AppService } from 'src/app.service';
import { Socket, Server } from 'socket.io';
import { TokenGuard } from 'src/guards/token.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;

  @UseGuards(TokenGuard)
  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    switch (payload?.cmdtype) {
      case 'login':
        this.appService.login(payload);
    }
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
