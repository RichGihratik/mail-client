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
  #socket = webSocket<Events>(WS_URL);
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

  get reconnect(): Observable<ListenAsEvent['data']> {
    return this.socket.pipe(
      filter((item) => item.event === LISTEN_AS),
      map((item) => (item as ListenAsEvent).data),
    );
  }

  get inbox(): Observable<InboxMessage> {
    return this.socket.pipe(
      filter((item) => item.event === INBOX_EVENT),
      map((item) => item.data as InboxMessage),
    );
  }

  constructor() {
    this.reconnect.subscribe((data) => {
      this.#name = data.name;
    });
  }

  listenAs(name: string) {
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

  disconnect() {
    this.#socket.complete();
  }
}

let socket: MessageSocket | undefined = undefined;

export function connect(name: string, reconnectCb?: () => void) {
  if (name === '') {
    disconnect();
    if (reconnectCb) reconnectCb();
    return socket;
  }

  if (!socket) socket = new MessageSocket();

  if (reconnectCb) {
    const sub = socket.reconnect.subscribe(() => {
      reconnectCb();
      sub.unsubscribe();
    });
  }

  socket.listenAs(name);
  return socket;
}

export function disconnect() {
  socket?.disconnect();
  socket = undefined;
}
