import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';

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
  private log = new Logger();

  constructor(private service: MessagesService) {}

  @SubscribeMessage(LISTEN_AS_NAME)
  listenAs(@MessageBody() dto: ListenAsDto) {
    this.log.log(
      `Connected listener with name "${dto.name}"`,
      MessagesGateway.name,
    );
    return this.service.listenAs(dto);
  }

  @SubscribeMessage(SEND_MESSAGE_NAME)
  sendMessage(@MessageBody() dto: SendMessageDto) {
    this.log.log(
      `Sent message from "${dto.from}" to "${dto.to}" with title "${dto.title}" and content "${dto.content}"`,
      MessagesGateway.name,
    );
    return this.service.sendMessage(dto);
  }
}
