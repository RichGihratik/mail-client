import { Outlet } from 'react-router-dom';
import { HeaderBar } from '@/components';

export function MainLayout() {
  return (
    <div className="flex flex-col flex-1 justify-center">
      <HeaderBar />
      <Outlet />
    </div>
  );
}
