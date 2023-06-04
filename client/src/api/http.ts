import { API_URL } from './const';
import { InboxMessage, SentMessage } from '@/types';

type RequestResult<T> = {
  errors?: string;
  result?: T;
};

type Messages = {
  inbox: InboxMessage[];
  sent: SentMessage[];
};

async function get<T>(path: string): Promise<RequestResult<T>> {
  const res = await fetch(`${API_URL}/${path}`, { method: 'GET' });
  if (!res.ok) {
    const err = (await res.json()).message;
    return { errors: Array.isArray(err) ? err.join(', ') : err };
  }
  return { result: await res.json() };
}

export async function getAllMessages(name: string) {
  return await get<Messages>(`users/${name}`);
}

export async function getSent(name: string) {
  return await get<SentMessage[]>(`users/${name}/sent`);
}

export async function getInbox(name: string) {
  return await get<InboxMessage[]>(`users/${name}/inbox`);
}

export async function getUsers() {
  return await get<string[]>(`users`);
}
