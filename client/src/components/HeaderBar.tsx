import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { observer } from 'mobx-react';

import { messageStore } from '@/store';
import { UserChip } from './UserChip';
import { ManageAccounts } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const HeaderBar = observer(() => {
  const navigate = useNavigate();

  const name = messageStore.listenAsName;

  function logout() {
    navigate('/');
    messageStore.setName('');
  }

  return (
    <div className="">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            fontWeight={'bold'}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Mail Client
          </Typography>
          {name !== '' ? (
            <div className="flex gap-2">
              <UserChip name={name} />
              <Button
                variant="contained"
                title="Refresh"
                size="small"
                startIcon={<ManageAccounts />}
                color="error"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
});
