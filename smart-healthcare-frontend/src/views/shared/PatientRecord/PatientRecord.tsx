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

  const appointment = details?.type === 'appointment'
    ? history.appointments.find((item) => String(item.id) === details.id) ?? null
    : null;

  const prescription = details?.type === 'prescription'
    ? history.prescriptions.find((item) => item.id === details.id) ?? null
    : null;

  function closeDetails() {
    setDetails(null);
  }

  return (
    <Box className={styles.record}>
      <RecordSummary history={history} />

      <RecordTimeline
        history={history}
        onOpenAppointment={(item) => setDetails({
          type: 'appointment',
          id: String(item.id),
          title: 'Appointment Details',
        })}
        onOpenPrescription={(item) => setDetails({
          type: 'prescription',
          id: item.id,
          title: 'Prescription Details',
        })}
        entryActions={entryActions}
      />

      {details !== null && (appointment !== null || prescription !== null) && (
        <Drawer open onClose={closeDetails} title={details.title}>
          {appointment !== null && (
            <AppointmentDetails appointment={appointment} heading={appointment.doctorName} />
          )}
          {prescription !== null && (
            <PrescriptionDetails prescription={prescription} heading={prescription.doctorName} />
          )}
        </Drawer>
      )}
    </Box>
  );
}
