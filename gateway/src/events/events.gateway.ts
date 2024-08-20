import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'; // Import WebSocket from 'ws'
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: WebSocket, payload: string) { // Change client to WebSocket and payload to string
    const parsedPayload = JSON.parse(payload); // Parse the incoming message
    const { token, cmdtype, ...body } = parsedPayload;
    
    switch (cmdtype) {
      case 'login':
        client.send(JSON.stringify(await this.appService.login(body)));
        break;
      case 'register':
        client.send(JSON.stringify(await this.appService.register(body)));
        break;
      case 'get_profile':
        client.send(JSON.stringify(await this.appService.getUserProfile(token)));
        break;
      case 'get_all_user':
        client.send(JSON.stringify(await this.appService.getAllUser(token)));
        break;
      case 'update_profile':
        client.send(JSON.stringify(await this.appService.updateUserProfile({
          token,
          body,
          reqid: 0,
        })));
        break;
      case 'delete_user':
        client.send(JSON.stringify(await this.appService.deleteOneUser({
          token,
          params: body?._id,
          reqid: 0,
        })));
        break;
    }
  }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleDisconnect(client: WebSocket) { // Change client to WebSocket
    console.log(`Client disconnected`);
  }

  handleConnection(client: WebSocket, ...args: any[]) { // Change client to WebSocket
    console.log('Client connected');
    
    // Optionally listen for messages directly if not using @SubscribeMessage
    client.on('message', (message) => this.handleMessage(client, message.toString()));
  }
}
