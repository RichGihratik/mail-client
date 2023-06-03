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
  if (!res.ok) return { errors: (await res.json()).message };
  return { result: await res.json() };
}

export async function getAllMessages(name: string) {
  return await get<Messages>(name);
}

export async function getSent(name: string) {
  return await get<SentMessage[]>(`${name}/sent`);
}

export async function getInbox(name: string) {
  return await get<InboxMessage[]>(`${name}/inbox`);
}
