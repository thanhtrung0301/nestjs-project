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

  // @UseGuards(TokenGuard)
  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    const { token, cmdtype, ...body } = payload;
    switch (cmdtype) {
      case 'login':
        return this.appService.login(body);
      case 'register':
        return this.appService.register(body);
      case 'get_profile':
        return this.appService.getUserProfile(token);
      case 'get_all_user':
        return this.appService.getAllUser(token);
      case 'update_profile':
        return this.appService.updateUserProfile(token, body);
      case 'delete_user':
        return this.appService.deleteOneUser(token, body?._id);
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
