import { AccountCircle } from '@mui/icons-material';
import { Chip } from '@mui/material';

export function UserChip({ name, ...props }: { name: string }) {
  return (
    <Chip color="secondary" icon={<AccountCircle />} label={name} {...props} />
  );
}
