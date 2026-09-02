import {
  type ReactNode,
  useState,
} from 'react';

import { Box } from '@mui/material';

import type {
  PatientHistoryResponse,
} from '../../../api/medicalRecords/MedicalRecordsAPI';
import { Drawer } from '../../../components/Drawer/Drawer';
import {
  AppointmentDetails,
} from '../AppointmentDetails/AppointmentDetails';
import {
  PrescriptionDetails,
} from '../PrescriptionDetails/PrescriptionDetails';
import { RecordSummary } from './RecordSummary';
import { RecordTimeline } from './RecordTimeline';
import styles from './PatientRecord.module.scss';

interface DetailsTarget {
  type: 'appointment' | 'prescription';
  id: string;
  title: string;
}

interface PatientRecordProps {
  history: PatientHistoryResponse;
  entryActions?: (entryId: string) => ReactNode;
}

export function PatientRecord({ history, entryActions }: PatientRecordProps) {
  const [details, setDetails] = useState<DetailsTarget | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function openDetails(target: DetailsTarget) {
    setDetails(target);
    setIsDrawerOpen(true);
  }

  const appointment = details?.type === 'appointment'
    ? history.appointments.find((item) => String(item.id) === details.id) ?? null
    : null;

  const prescription = details?.type === 'prescription'
    ? history.prescriptions.find((item) => item.id === details.id) ?? null
    : null;

  function closeDetails() {
    setIsDrawerOpen(false);
  }

  return (
    <Box className={styles.record}>
      <RecordSummary history={history} />

      <RecordTimeline
        history={history}
        onOpenAppointment={(item) => openDetails({
          type: 'appointment',
          id: String(item.id),
          title: 'Appointment Details',
        })}
        onOpenPrescription={(item) => openDetails({
          type: 'prescription',
          id: item.id,
          title: 'Prescription Details',
        })}
        entryActions={entryActions}
      />

      <Drawer open={isDrawerOpen} onClose={closeDetails} title={details?.title ?? ''}>
        {appointment !== null && (
          <AppointmentDetails appointment={appointment} heading={appointment.doctorName} />
        )}
        {prescription !== null && (
          <PrescriptionDetails prescription={prescription} heading={prescription.doctorName} />
        )}
      </Drawer>
    </Box>
  );
}
