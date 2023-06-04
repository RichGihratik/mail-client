import { getAllMessages, type ExtractPromise, connect } from '@/api';
import { InboxMessage, SentMessage } from '@/types';
import { makeAutoObservable } from 'mobx';

class MessageStore {
  constructor() {
    makeAutoObservable(this);
  }

  private _listenAsName = '';

  private res: ExtractPromise<ReturnType<typeof getAllMessages>> = {};

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
    this.refresh();
  }

  private setLoading(state: boolean) {
    this._loading = state;
  }

  async refresh() {
    if (this._listenAsName === '') {
      this.res = {};
    } else {
      this.setLoading(true);
      this.res = await getAllMessages(this._listenAsName);
    }

    this._socket = connect(this._listenAsName, () => {
      this.setLoading(false);
    });
  }

  get errors() {
    return this.res.errors;
  }

  get sent() {
    return (this.res.result?.sent ?? []).reduce(
      (acc, msg) => acc.set(msg.id, msg),
      new Map<number, SentMessage>(),
    );
  }

  get inbox() {
    return (this.res.result?.inbox ?? []).reduce(
      (acc, msg) => acc.set(msg.id, msg),
      new Map<number, InboxMessage>(),
    );
  }
}

export const messageStore = new MessageStore();
