import { observer } from 'mobx-react';
import {
  Fab,
  Popover,
  Typography,
  TextField,
  Button,
  TextareaAutosize,
  IconButton,
  Toolbar,
} from '@mui/material';
import val from 'validator';
import { Edit, Close } from '@mui/icons-material';
import { ChangeEvent, useState } from 'react';
import { messageStore } from '@/store';
import { UserAutocomplete } from './UserAutocomplete';

export const NewMessageForm = observer(() => {
  const [opened, setOpened] = useState(false);

  const [to, setTo] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { socket } = messageStore;

  function sendMessage() {
    if (socket && to !== '' && val.isAlpha(to)) {
      socket.sendMessage({ to, title, content });
      setOpened(false);
    }
  }

  function handleTitle({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    setTitle(value);
  }

  return (
    <>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={opened}
        onClose={() => setOpened(false)}
      >
        <div className="new-message-editor flex flex-col">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              New message:
            </Typography>
            <IconButton onClick={() => setOpened(false)}>
              <Close />
            </IconButton>
          </Toolbar>

          <div className="p-10 flex flex-col justify-center gap-5 flex-1">
            <UserAutocomplete onChange={(to) => setTo(to)} />
            <TextField
              fullWidth
              variant="standard"
              onChange={handleTitle}
              label="Title"
            />
            <TextareaAutosize
              className="my-5 bg-inherit rounded-xl border-2 border-neutral-400 focus-visible:outline-none focus-visible:border-neutral-300 border-solid p-4"
              placeholder="Type your content..."
              minRows={4}
              onChange={({ target: { value } }) => setContent(value)}
            />
            <Button
              disabled={to === '' || !val.isAlpha(to)}
              variant="contained"
              color="primary"
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </Popover>
      <div className="fixed right-10 bottom-10">
        <Fab color="primary" onClick={() => setOpened(true)}>
          <Edit />
        </Fab>
      </div>
    </>
  );
});
