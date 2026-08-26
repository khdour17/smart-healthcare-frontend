import {
  type ReactNode,
  useState,
} from 'react';

import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import {
  Box,
  ButtonBase,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import type {
  AppointmentResponse,
} from '../../../api/appointments/AppointmentsAPI';
import type {
  PatientHistoryResponse,
} from '../../../api/medicalRecords/MedicalRecordsAPI';
import type {
  PrescriptionResponse,
} from '../../../api/prescriptions/PrescriptionsAPI';
import { formatTime } from '../../../utils/formatTime';
import {
  AppointmentStatusChip,
} from '../AppointmentStatusChip/AppointmentStatusChip';
import styles from './RecordTimeline.module.scss';

type ItemType = 'entry' | 'appointment' | 'prescription';

interface TimelineItem {
  id: string;
  type: ItemType;
  date: string;
  title: string;
  subtitle: string;
  body?: string;
  aside?: ReactNode;
  onOpen?: () => void;
}

interface RecordTimelineProps {
  history: PatientHistoryResponse;
  onOpenAppointment: (appointment: AppointmentResponse) => void;
  onOpenPrescription: (prescription: PrescriptionResponse) => void;
  entryActions?: (entryId: string) => ReactNode;
}

const markerIcons: Record<ItemType, ReactNode> = {
  entry: <DescriptionIcon fontSize="small" />,
  appointment: <EventIcon fontSize="small" />,
  prescription: <MedicationIcon fontSize="small" />,
};

const markerStyles: Record<ItemType, string> = {
  entry: styles.markerEntry,
  appointment: styles.markerAppointment,
  prescription: styles.markerPrescription,
};

const filters: { value: ItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'entry', label: 'Entries' },
  { value: 'appointment', label: 'Visits' },
  { value: 'prescription', label: 'Prescriptions' },
];

export function RecordTimeline({
  history,
  onOpenAppointment,
  onOpenPrescription,
  entryActions,
}: RecordTimelineProps) {
  const [filter, setFilter] = useState<ItemType | 'all'>('all');

  const items: TimelineItem[] = [
    ...history.entries.map((entry) => ({
      id: `entry-${entry.id}`,
      type: 'entry' as const,
      date: entry.recordDate,
      title: entry.title,
      subtitle: `Recorded by ${entry.doctorName}`,
      body: entry.description ?? undefined,
      aside: entryActions?.(entry.id),
    })),
    ...history.appointments.map((appointment) => ({
      id: `appointment-${appointment.id}`,
      type: 'appointment' as const,
      date: appointment.appointmentDate,
      title: `Appointment with ${appointment.doctorName}`,
      subtitle: `${formatTime(appointment.startTime)} – ${formatTime(appointment.endTime)}`,
      body: appointment.reason ?? undefined,
      aside: <AppointmentStatusChip status={appointment.status} />,
      onOpen: () => onOpenAppointment(appointment),
    })),
    ...history.prescriptions.map((prescription) => ({
      id: `prescription-${prescription.id}`,
      type: 'prescription' as const,
      date: prescription.prescriptionDate,
      title: `Prescription from ${prescription.doctorName}`,
      subtitle: prescription.medicines.length === 1
        ? '1 medicine'
        : `${prescription.medicines.length} medicines`,
      body: prescription.diagnosis ?? undefined,
      onOpen: () => onOpenPrescription(prescription),
    })),
  ]
    .filter((item) => filter === 'all' || item.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Box className={styles.timeline}>
      <Box className={styles.filters}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={filter}
          onChange={(_, next) => next && setFilter(next)}
        >
          {filters.map((option) => (
            <ToggleButton key={option.value} value={option.value}>{option.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {items.length === 0 ? (
        <Typography className={styles.empty} color="textSecondary">
          {filter === 'all' ? 'Nothing recorded yet.' : 'Nothing of this type recorded yet.'}
        </Typography>
      ) : (
        <Box className={styles.stream}>
          {items.map((item) => {
            const content = (
              <>
                <Box className={styles.cardHead}>
                  <Typography variant="subtitle2">{item.title}</Typography>
                  {item.aside}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {item.date} · {item.subtitle}
                </Typography>
                {item.body && (
                  <Typography variant="body2" color="textSecondary" className={styles.body}>{item.body}</Typography>
                )}
              </>
            );

            return (
              <Box key={item.id} className={styles.item}>
                <Box className={`${styles.marker} ${markerStyles[item.type]}`}>{markerIcons[item.type]}</Box>
                {item.onOpen ? (
                  <ButtonBase className={`${styles.card} ${styles.clickable}`} onClick={item.onOpen} focusRipple>
                    {content}
                  </ButtonBase>
                ) : (
                  <Box className={styles.card}>{content}</Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
