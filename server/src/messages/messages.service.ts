import { Injectable, Logger } from '@nestjs/common';
import { Subject, filter, Observable, map, Subscription } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';

import { Message, PersonalisedMessage } from './message.interface';
import { SendMessageDto, ListenAsDto } from './dto';
import { DatabaseService } from '@/database';
import { INBOX_MESSAGE_NAME } from './const';
import { WebSocket } from 'ws';

const LOG_CONTEXT = 'MessagesSocket';

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}

  private messageObservable = new Subject<Message>();

  private subs = new WeakMap<WebSocket, Subscription>();

  private log = new Logger();

  listenAs(ip: WebSocket, dto: ListenAsDto) {
    if (this.subs.has(ip)) {
      this.subs.get(ip).unsubscribe();
      this.log.log(
        `Reconnected old listener with name "${dto.name}"`,
        LOG_CONTEXT,
      );
    } else
      this.log.log(
        `Connected new listener with name "${dto.name}"`,
        LOG_CONTEXT,
      );
    const obs = this.createObservable(dto);
    this.subs.set(
      ip,
      obs.subscribe({
        next(value) {
          ip.send(JSON.stringify(value));
        },
      }),
    );

    return dto;
  }

  private createObservable(
    dto: ListenAsDto,
  ): Observable<WsResponse<PersonalisedMessage>> {
    const result = this.messageObservable.pipe(
      filter((item) => item.to === dto.name),
      map((item) => {
        const copy = { ...item };
        delete copy.to;
        return { event: INBOX_MESSAGE_NAME, data: copy };
      }),
    );
    return result;
  }

  async sendMessage(dto: SendMessageDto) {
    await this.db.message.create({ data: { ...dto } });
    this.messageObservable.next({ ...dto });

    this.log.log(
      `Sent message from "${dto.from}" to "${dto.to}" with title "${dto.title}" and content "${dto.content}"`,
      LOG_CONTEXT,
    );
    return dto;
  }
}
