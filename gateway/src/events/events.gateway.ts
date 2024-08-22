import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}

  @WebSocketServer() server: Server;
  private clients: object = {};

  @SubscribeMessage('message')
  async handleMessage(client_id: string, payload: string) {
    const parsedPayload = JSON.parse(payload);
    const { token, cmdtype, ...body } = parsedPayload;

    switch (cmdtype) {
      case 'login':
        this.appService.login({ ...body, client_id });
        break;
      case 'register':
        this.appService.register({ ...body, client_id });
        break;
      case 'get_profile':
        this.appService.getUserProfile({ token, client_id } as any);
        break;
      case 'get_all_user':
        this.appService.getAllUser({ token, client_id } as any);
        break;
      case 'update_profile':
        this.appService.updateUserProfile({
          token,
          body,
          client_id,
        });
        break;
      case 'delete_user':
        this.appService.deleteOneUser({
          token,
          params: body?._id,
          client_id,
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
    // if (this.client && this.client.readyState === WebSocket.OPEN) {
    //   console.log('Client already connected, ignoring new connection');
    //   return;
    // }

    console.log('Client connected', args?.[0].headers['sec-websocket-key']);
    const client_id = args?.[0].headers['sec-websocket-key'];
    this.clients[client_id] = client;

    client.on('message', (message) =>
      this.handleMessage(client_id, message.toString()),
    );
  }

  sendToClient(client_id: string, message: any) {
    if (
      this.clients[client_id] &&
      this.clients[client_id].readyState === WebSocket.OPEN
    ) {
      this.clients[client_id].send(JSON.stringify(message));
    } else {
      console.error('Client not connected or readyState is not OPEN');
    }
  }
}
