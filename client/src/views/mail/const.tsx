import { Send, Inbox } from '@mui/icons-material';
import { Tab } from '@mui/material';
import { RouteObject } from 'react-router-dom';

export function createTabs(path: string) {
  const defaultRoute = `${path}/inbox`;

  const map = {
    [defaultRoute]: {
      id: 1,
      icon: <Inbox />,
      label: 'Inbox',
    },
    [`${path}/sent`]: {
      id: 0,
      icon: <Send />,
      label: 'Sent',
    },
  };

  return [
    map,
    Object.entries(map).map(([path, tab]) => (
      <Tab
        icon={tab.icon}
        value={path}
        iconPosition="start"
        label={tab.label}
        key={tab.id}
      />
    )),
    defaultRoute,
  ] as const;
}

export const routes: RouteObject[] = [
  {
    path: '/:name/sent',
    element: <>Sent</>,
  },
  {
    path: '/:name/inbox',
    element: <>Inbox</>,
  },
];
