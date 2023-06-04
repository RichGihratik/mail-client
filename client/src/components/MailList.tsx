import { observer } from 'mobx-react';
import { messageStore } from '@/store';

type Props = {
  type: 'inbox' | 'sent';
};

export const MailList = observer(({ type }: Props) => {
  const list = type === 'inbox' ? messageStore.inbox : messageStore.sent;

  return (
    <div className="">
      <></>
    </div>
  );
});
