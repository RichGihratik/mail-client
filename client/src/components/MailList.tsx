import { observer } from 'mobx-react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { messageStore } from '@/store';
import { UserChip } from './UserChip';

type Props = {
  type: 'inbox' | 'sent';
};

export const MailList = observer(({ type }: Props) => {
  const list =
    type === 'inbox'
      ? [...messageStore.inbox.values()].reverse()
      : [...messageStore.sent.values()].reverse();

  return (
    <div className="p-10 flex flex-col items-stretch w-100 rounded-lg">
      {list.length !== 0 ? (
        list.map((msg) => (
          <Accordion key={msg.id} sx={{ flexGrow: 1 }} elevation={10}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography
                component="span"
                sx={{ flexShrink: 0, minWidth: '40%', marginRight: 2 }}
                fontWeight="bold"
              >
                {msg.title === '' ? (
                  <Typography
                    fontWeight="normal"
                    sx={{ color: 'text.secondary' }}
                  >
                    (empty title)
                  </Typography>
                ) : (
                  msg.title
                )}
              </Typography>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {'from' in msg && type === 'inbox' ? (
                  <>
                    <span className="mx-3 hidden sm:inline">from</span>
                    <UserChip name={msg.from} />
                  </>
                ) : 'to' in msg ? (
                  <>
                    <span className="mx-3 hidden sm:inline">sent to</span>
                    <UserChip name={msg.to} />
                  </>
                ) : (
                  <>Error occured</>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {msg.content === '' ? (
                  <Typography
                    fontWeight="normal"
                    component="span"
                    sx={{ color: 'text.secondary' }}
                  >
                    (empty content)
                  </Typography>
                ) : (
                  msg.content
                )}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          No messages
        </Typography>
      )}
    </div>
  );
});
