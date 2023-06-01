import { Injectable } from '@nestjs/common';
import { Subject, filter, Observable, map } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';

import { Message, PersonalisedMessage } from './message.interface';
import { SendMessageDto, ListenAsDto } from './dto';
import { DatabaseService } from '@/database';
import { INBOX_MESSAGE_NAME } from './const';

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}

  private messageObservable = new Subject<Message>();

  listenAs(listener: ListenAsDto): Observable<WsResponse<PersonalisedMessage>> {
    return this.messageObservable.pipe(
      filter((item) => item.to === listener.name),
      map((item) => {
        const copy = { ...item };
        delete copy.to;
        return { event: INBOX_MESSAGE_NAME, data: copy };
      }),
    );
  }

  async sendMessage(inputMessage: SendMessageDto) {
    await this.db.message.create({ data: { ...inputMessage } });
    this.messageObservable.next({ ...inputMessage });
    return 'success';
  }
}
