import { InboxMessage, FullMessageInfo, SentMessage } from '@/types';
import { WS_URL, LISTEN_AS, SEND_EVENT, INBOX_EVENT } from './const';
import { Observable, filter, map, share } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

type ListenAsEvent = {
  event: typeof LISTEN_AS;
  data: {
    name: string;
  };
};

type SendEvent = {
  event: typeof SEND_EVENT;
  data: SentMessage;
};

type InboxEvent = {
  event: typeof INBOX_EVENT;
  data: InboxMessage;
};

type Events = ListenAsEvent | SendEvent | InboxEvent;

export class MessageSocket {
  #socket = webSocket<Events>({ url: WS_URL });
  #name = '';

  get socket() {
    return this.#socket.pipe(share());
  }

  get sent(): Observable<SentMessage> {
    return this.socket.pipe(
      filter((item) => item.event === SEND_EVENT),
      map((item) => item.data as SentMessage),
    );
  }

  get inbox(): Observable<InboxMessage> {
    return this.socket.pipe(
      filter((item) => item.event === INBOX_EVENT),
      map((item) => item.data as InboxMessage),
    );
  }

  #loading = false;

  get loading() {
    return this.#loading;
  }

  constructor(name: string) {
    this.listenAs(name);
    this.socket
      .pipe(
        filter((item) => item.event === LISTEN_AS),
        map((item) => (item as ListenAsEvent).data.name),
      )
      .subscribe((item) => {
        this.#name = item;
        this.#loading = false;
      });
  }

  listenAs(name: string) {
    this.#loading = true;
    this.#socket.next({
      event: LISTEN_AS,
      data: { name },
    });
  }

  sendMessage(msg: SentMessage) {
    const result: FullMessageInfo = {
      ...msg,
      from: this.#name,
    };
    this.#socket.next({
      event: SEND_EVENT,
      data: result,
    });
  }
}

let socket: MessageSocket | undefined = undefined;

export function connect(name: string) {
  if (name === '') {
    disconnect();
    return socket;
  }
  if (!socket) socket = new MessageSocket(name);
  else socket.listenAs(name);
  return socket;
}

export function disconnect() {
  socket = undefined;
}
