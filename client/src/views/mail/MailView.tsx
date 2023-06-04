import { Tabs, Divider } from '@mui/material';
import {
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { messageStore } from '@/store';
import { Loading } from '@/components';
import { observer } from 'mobx-react';
import { isValidNameLoaderData } from '@/router';
import { createTabs } from './const';

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

  return map[pathname] ? (
    <>
      <Tabs value={pathname} onChange={(_, path) => navigate(path)}>
        {tabs}
      </Tabs>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1">
          <Outlet />
        </div>
      )}
    </>
  ) : (
    <Navigate to={defaultRoute} />
  );
});
