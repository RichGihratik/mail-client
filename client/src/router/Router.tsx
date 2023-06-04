import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { EnterNameView, MailView, MainLayout, mailRoutes } from '@/views';
import { NameLoaderData } from './typeguards';
import val from 'validator';
import { messageStore } from '@/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <EnterNameView />,
      },
      {
        path: '/:name',
        loader: ({ params }): Partial<NameLoaderData> => {
          if (typeof params.name === 'string' && val.isAlpha(params.name))
            messageStore.setName(params.name);
          return { name: params.name };
        },
        element: <MailView />,
        children: mailRoutes,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
