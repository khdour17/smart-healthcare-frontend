import {
  type ChangeEvent,
  type SubmitEvent,
  useState,
} from 'react';

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  TextField,
} from '@mui/material';

import {
  createPrescription,
  type PrescriptionRequest,
  type PrescriptionResponse,
  updatePrescription,
} from '../../../api/prescriptions/PrescriptionsAPI';
import styles from './PrescriptionForm.module.scss';

interface PrescriptionFormProps {
  appointmentId: number;
  prescription?: PrescriptionResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PrescriptionForm({ appointmentId, prescription, onSuccess, onCancel }: PrescriptionFormProps) {
  const [formData, setFormData] = useState<PrescriptionRequest>({
    appointmentId,
    medicines: prescription?.medicines ?? [],
    diagnosis: prescription?.diagnosis ?? '',
    instructions: prescription?.instructions ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: 'diagnosis' | 'instructions') {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleMedicinesChange(_: unknown, medicines: string[]) {
    setFormData((prev) => ({ ...prev, medicines }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (prescription) await updatePrescription(prescription.id, formData);
      else await createPrescription(formData);
      onSuccess();
    } catch {
      setError('Could not save the prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField label="Diagnosis" value={formData.diagnosis} onChange={handleChange('diagnosis')} fullWidth />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={formData.medicines}
        onChange={handleMedicinesChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Medicines"
            helperText="Type a medicine and press Enter to add it"
          />
        )}
      />

      <TextField
        label="Instructions"
        value={formData.instructions}
        onChange={handleChange('instructions')}
        fullWidth
        multiline
        minRows={3}
      />

      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting || formData.medicines.length === 0}>
          {isSubmitting ? 'Saving...' : prescription ? 'Save Changes' : 'Save Prescription'}
        </Button>
      </Box>
    </Box>
  );
}
