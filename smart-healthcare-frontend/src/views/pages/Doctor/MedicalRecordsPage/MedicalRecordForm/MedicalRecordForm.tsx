import {
  type ChangeEvent,
  type SubmitEvent,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  TextField,
} from '@mui/material';

import {
  createMedicalRecord,
  type MedicalRecordRequest,
  type MedicalRecordResponse,
  updateMedicalRecord,
} from '../../../../../api/medicalRecords/MedicalRecordsAPI';
import styles from './MedicalRecordForm.module.scss';

interface MedicalRecordFormProps {
  patientId: number;
  entry?: MedicalRecordResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MedicalRecordForm({ patientId, entry, onSuccess, onCancel }: MedicalRecordFormProps) {
  const [formData, setFormData] = useState<MedicalRecordRequest>({
    patientId,
    title: entry?.title ?? '',
    description: entry?.description ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: 'title' | 'description') {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (entry) await updateMedicalRecord(entry.id, formData);
      else await createMedicalRecord(formData);
      onSuccess();
    } catch {
      setError('Could not save this note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField label="Title" value={formData.title} onChange={handleChange('title')} required fullWidth />

      <TextField
        label="Description"
        value={formData.description}
        onChange={handleChange('description')}
        fullWidth
        multiline
        minRows={5}
      />

      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting || formData.title.trim() === ''}>
          {isSubmitting ? 'Saving...' : entry ? 'Save Changes' : 'Add Note'}
        </Button>
      </Box>
    </Box>
  );
}
