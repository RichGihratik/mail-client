import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { EnterNameView, MailView, MainLayout } from '@/views';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '.',
        element: <EnterNameView />,
      },
      {
        path: ':name',
        element: <MailView />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
