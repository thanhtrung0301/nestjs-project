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
  private client;

  @SubscribeMessage('message')
  async handleMessage(client: WebSocket, payload: string) {
    this.client = client;

    const parsedPayload = JSON.parse(payload);
    const { token, cmdtype, ...body } = parsedPayload;

    switch (cmdtype) {
      case 'login':
        this.appService.login(body);
        break;
      case 'register':
        this.appService.register(body);
        break;
      case 'get_profile':
        this.appService.getUserProfile({ token } as any);
        break;
      case 'get_all_user':
        this.appService.getAllUser({ token } as any);
        break;
      case 'update_profile':
        this.appService.updateUserProfile({
          token,
          body,
        });

        break;
      case 'delete_user':
        this.appService.deleteOneUser({
          token,
          params: body?._id,
        });
        break;
    }
  }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleDisconnect(client: WebSocket) {
    // Change client to WebSocket
    console.log(`Client disconnected`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    console.log('Client connected');

    client.on('message', (message) =>
      this.handleMessage(client, message.toString()),
    );
  }

  sendToClient(message: any) {
    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify(message));
    } else {
      console.error('Client not connected or readyState is not OPEN');
    }
  }
}
