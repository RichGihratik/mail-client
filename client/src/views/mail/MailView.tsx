import { Tabs, Divider, IconButton, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import {
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import val from 'validator';
import { observer } from 'mobx-react';

import { messageStore } from '@/store';
import { Loading } from '@/components';
import { isValidNameLoaderData } from '@/router';
import { createTabs } from './const';
import { StatusBar } from '@/components';

export const MailView = observer(() => {
  const { loading } = messageStore;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const data = useLoaderData();

  if (!isValidNameLoaderData(data))
    throw new TypeError(
      `${JSON.stringify(data)} is not valid name in route loader`,
    );

  const name = data.name;
  const [map, tabs, defaultRoute] = createTabs(`/${name}`);

  return val.isAlpha(name) ? (
    map[pathname] ? (
      <>
        <div className="flex items-center px-5">
          <Typography fontWeight="bold">Messages:</Typography>
          <Tabs
            sx={{ flexGrow: 1 }}
            value={pathname}
            onChange={(_, path) => navigate(path)}
          >
            {tabs}
          </Tabs>
          <IconButton title="Refresh" onClick={() => messageStore.refresh()}>
            <Refresh />
          </IconButton>
        </div>
        <Divider />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 w-100 flex flex-col">
            <Outlet />
            <StatusBar />
          </div>
        )}
      </>
    ) : (
      <Navigate to={defaultRoute} />
    )
  ) : (
    <Navigate to="/" />
  );
});
