import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

import { LISTEN_AS_NAME, SEND_MESSAGE_NAME } from './const';
import { CLIENT_URL_CONFIG_KEY } from '@/const';
import { MessagesService } from './messages.service';
import { ListenAsDto, SendMessageDto } from './dto';

@UsePipes(
  new ValidationPipe({
    exceptionFactory(errors) {
      return new WsException(errors);
    },
  }),
)
@WebSocketGateway({
  cors: {
    origin: process.env[CLIENT_URL_CONFIG_KEY],
  },
})
export class MessagesGateway {
  constructor(private service: MessagesService) {}

  @SubscribeMessage(LISTEN_AS_NAME)
  listenAs(
    @MessageBody() dto: ListenAsDto,
    @ConnectedSocket() socket: WebSocket,
  ) {
    return {
      event: LISTEN_AS_NAME,
      data: this.service.listenAs(socket, dto),
    };
  }

  @SubscribeMessage(SEND_MESSAGE_NAME)
  async sendMessage(@MessageBody() dto: SendMessageDto) {
    return {
      event: SEND_MESSAGE_NAME,
      data: await this.service.sendMessage(dto),
    };
  }
}
