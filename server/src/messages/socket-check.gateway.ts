import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer as WsServer } from 'ws';

const CHECK_DELAY = 10000;
const LOG_CONTEXT = 'SocketChecking';
const LOG_CONFIG_KEY = 'SOCKET_LOGGING';

export abstract class SocketCheckGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private timer: NodeJS.Timer = null;
  private logger = new Logger(LOG_CONTEXT);
  private aliveMap = new WeakMap<WebSocket, boolean>();
  private loggingEnabled = !!process.env[LOG_CONFIG_KEY];

  onModuleDestroy() {
    clearInterval(this.timer);
  }

  handleConnection(client: WebSocket) {
    this.aliveMap.set(client, true);
    client.on('pong', () => {
      this.log(`Pong received`);
      this.aliveMap.set(client, true);
    });
  }

  handleDisconnect(client: WebSocket) {
    this.aliveMap.delete(client);
  }

  afterInit(server: WsServer) {
    server.on('close', () => clearInterval(this.timer));
    this.timer = setInterval(() => {
      this.log(`Starting socket checks...`);
      server.clients.forEach((ws) => {
        if (this.aliveMap.get(ws) !== true) {
          this.logger.warn(`Found dead connection. Disconnecting...`);
          ws.terminate();
        }
        this.aliveMap.set(ws, false);
        this.log(`Send ping to client...`);
        ws.ping();
      });
    }, CHECK_DELAY);
  }

  private log(msg: string) {
    if (this.loggingEnabled) this.logger.log(msg);
  }
}
