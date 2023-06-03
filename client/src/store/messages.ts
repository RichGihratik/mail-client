import { getAllMessages } from '@/api';
import { InboxMessage, SentMessage } from '@/types';
import { atom, selector } from 'recoil';

export const listenAsName = atom({
  key: 'listenAsName',
  default: '',
});

const resResult = selector({
  key: 'resResult',
  get: async ({ get }) => {
    const name = get(listenAsName);
    if (name !== '') return {};
    else return await getAllMessages(name);
  },
});

export const errors = selector({
  key: 'resError',
  get: ({ get }) => {
    return get(resResult).errors ?? undefined;
  },
});

const msgLists = selector({
  key: 'resultLists',
  get: ({ get }) => {
    const res = get(resResult).result;
    const resObj = res ? res : { sent: [], inbox: [] };

    return resObj;
  },
});

export const sent = selector({
  key: 'sentMessages',
  get: ({ get }) => {
    return get(msgLists).sent.reduce(
      (acc, msg) => acc.set(msg.id, msg),
      new Map<number, SentMessage>(),
    );
  },
});

export const inbox = selector({
  key: 'sentMessages',
  get: ({ get }) => {
    return get(msgLists).inbox.reduce(
      (acc, msg) => acc.set(msg.id, msg),
      new Map<number, InboxMessage>(),
    );
  },
});
