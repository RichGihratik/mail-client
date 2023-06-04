import { getAllMessages, connect } from '@/api';
import { InboxMessage, SentMessage } from '@/types';
import { makeAutoObservable } from 'mobx';
import { Subscription } from 'rxjs';

class MessageStore {
  constructor() {
    makeAutoObservable(this);
  }

  private _listenAsName = '';

  private _loading = false;

  private _socket = connect(this._listenAsName);

  get loading() {
    return this._loading;
  }

  get socket() {
    return this._socket;
  }

  get listenAsName() {
    return this._listenAsName;
  }

  setName(name: string) {
    this._listenAsName = name;
    this.inboxSub?.unsubscribe();
    this.sentSub?.unsubscribe();

    this.setLoading(true);

    this._socket = connect(this._listenAsName, () => {
      this.setLoading(false);
    });

    if (this._socket) {
      this.inboxSub = this._socket.inbox.subscribe((msg) => this.addInbox(msg));
      this.sentSub = this._socket.sent.subscribe((msg) => this.addSent(msg));
    }

    this.refresh();
  }

  private setLoading(state: boolean) {
    this._loading = state;
  }

  sent = new Map<number, SentMessage>();
  inbox = new Map<number, InboxMessage>();

  private addSent(msg: SentMessage) {
    this.sent.set(msg.id, msg);
  }

  private addInbox(msg: InboxMessage) {
    this.inbox.set(msg.id, msg);
  }

  private inboxSub: Subscription | undefined = undefined;
  private sentSub: Subscription | undefined = undefined;

  async refresh() {
    if (this._listenAsName === '') {
      this.sent = new Map();
      this.inbox = new Map();
    } else {
      this.setLoading(true);
      const res = await getAllMessages(this._listenAsName);

      this._errors = res.errors;

      this.sent = (res.result?.sent ?? []).reduce(
        (acc, msg) => acc.set(msg.id, msg),
        new Map(),
      );

      this.inbox = (res.result?.inbox ?? []).reduce(
        (acc, msg) => acc.set(msg.id, msg),
        new Map(),
      );

      this.setLoading(false);
    }
  }

  private _errors: string | undefined = undefined;

  get errors() {
    return this._errors;
  }
}

export const messageStore = new MessageStore();
