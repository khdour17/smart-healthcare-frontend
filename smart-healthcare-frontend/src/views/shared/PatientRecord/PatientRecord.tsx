import {
  type ReactNode,
  useState,
} from 'react';

import { Box } from '@mui/material';

import type {
  AppointmentResponse,
} from '../../../api/appointments/AppointmentsAPI';
import type {
  PatientHistoryResponse,
} from '../../../api/medicalRecords/MedicalRecordsAPI';
import type {
  PrescriptionResponse,
} from '../../../api/prescriptions/PrescriptionsAPI';
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

interface PatientRecordProps {
  history: PatientHistoryResponse;
  entryActions?: (entryId: string) => ReactNode;
}

export function PatientRecord({ history, entryActions }: PatientRecordProps) {
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionResponse | null>(null);

  function closeDrawers() {
    setAppointment(null);
    setPrescription(null);
  }

  return (
    <Box className={styles.record}>
      <RecordSummary history={history} />

      <RecordTimeline
        history={history}
        onOpenAppointment={setAppointment}
        onOpenPrescription={setPrescription}
        entryActions={entryActions}
      />

      {appointment !== null && (
        <Drawer open onClose={closeDrawers} title="Appointment Details">
          <AppointmentDetails appointment={appointment} heading={appointment.doctorName} />
        </Drawer>
      )}

      {prescription !== null && (
        <Drawer open onClose={closeDrawers} title="Prescription Details">
          <PrescriptionDetails prescription={prescription} heading={prescription.doctorName} />
        </Drawer>
      )}
    </Box>
  );
}
