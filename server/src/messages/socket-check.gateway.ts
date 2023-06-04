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
    if (this.timer === null) this.startSocketCheck();
    client.on('pong', () => {
      this.log(`Pong received`);
      this.aliveMap.set(client, true);
    });
  }

  handleDisconnect(client: WebSocket) {
    this.aliveMap.delete(client);
    if (this.server?.clients.size === 0) this.stopSocketCheck();
  }

  protected server: WsServer | undefined = undefined;

  protected stopSocketCheck() {
    this.log('Stopping socket checking...');
    clearInterval(this.timer);
    this.timer = null;
  }

  protected startSocketCheck() {
    this.log('Starting socket checking...');
    this.timer = setInterval(() => {
      this.server.clients.forEach((ws) => {
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

  afterInit(server: WsServer) {
    this.server = server;
    this.server.on('close', () => {
      clearInterval(this.timer);
      this.timer = null;
    });
  }

  private log(msg: string) {
    if (this.loggingEnabled) this.logger.log(msg);
  }
}
