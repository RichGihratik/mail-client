import { CircularProgress } from '@mui/material';

export function Loading() {
  return (
    <div className="flex justify-center items-center flex-1 w-100 h-100">
      <CircularProgress color="primary" />
    </div>
  );
}
