import { observer } from 'mobx-react';
import { Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { messageStore } from '@/store';
import { Subscription } from 'rxjs';

let inboxSub: Subscription | undefined = undefined;
let sentSub: Subscription | undefined = undefined;

export const StatusBar = observer(() => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const socket = messageStore.socket;

  useEffect(() => {
    sentSub?.unsubscribe();
    inboxSub?.unsubscribe();
    if (messageStore.socket) {
      const {
        socket: { sent, inbox },
      } = messageStore;

      sentSub = sent.subscribe(() => {
        setMessage('Message sent!');
        setOpen(true);
      });

      inboxSub = inbox.subscribe((msg) => {
        setMessage(`New message from ${msg.from}!`);
        setOpen(true);
      });
    }
  }, [socket]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="info"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
});
