export interface PersonalisedMessage {
  id: number;
  from: string;
  title: string;
  content: string;
}

export interface Message extends PersonalisedMessage {
  to: string;
}
