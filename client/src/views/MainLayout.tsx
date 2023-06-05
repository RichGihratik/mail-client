import { Outlet } from 'react-router-dom';
import { HeaderBar } from '@/components';
import { Paper } from '@mui/material';

export function MainLayout() {
  return (
    <Paper className="flex flex-col flex-1 justify-center">
      <HeaderBar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </Paper>
  );
}
