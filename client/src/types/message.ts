export interface Message {
  id: number;
  title: string;
  content: string;
}

export interface InboxMessage extends Message {
  from: string;
}

export interface SentMessage extends Message {
  to: string;
}

export interface FullMessageInfo extends InboxMessage, SentMessage {}
