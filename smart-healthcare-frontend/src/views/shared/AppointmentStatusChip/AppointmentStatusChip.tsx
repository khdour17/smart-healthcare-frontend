import { Chip } from '@mui/material';

import type { AppointmentStatus } from '../../../types/common';

interface AppointmentStatusChipProps {
  status: AppointmentStatus;
}

const statusColors: Record<AppointmentStatus, 'primary' | 'success' | 'default'> = {
  SCHEDULED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

export function AppointmentStatusChip({ status }: AppointmentStatusChipProps) {
  return (
    <Chip
      label={status.charAt(0) + status.slice(1).toLowerCase()}
      size="small"
      color={statusColors[status]}
    />
  );
}
