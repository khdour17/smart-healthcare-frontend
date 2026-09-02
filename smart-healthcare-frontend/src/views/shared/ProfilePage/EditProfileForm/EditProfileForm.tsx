import {
  type SubmitEvent,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  TextField,
} from '@mui/material';

import { openNativePicker } from '../../../../utils/openNativePicker';
import styles from './EditProfileForm.module.scss';

export interface ProfileField {
  name: string;
  label: string;
  value: string;
  type?: 'text' | 'date';
  required?: boolean;
}

interface EditProfileFormProps {
  fields: ProfileField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onSuccess: () => void;
  onCancel: () => void;
}

function initialValues(fields: ProfileField[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.name, field.value]));
}

export function EditProfileForm({ fields, onSubmit, onSuccess, onCancel }: EditProfileFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(name: string, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onSuccess();
    } catch {
      setError('Could not save your profile. Check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          type={field.type ?? 'text'}
          value={values[field.name]}
          onChange={(event) => handleChange(field.name, event.target.value)}
          required={field.required}
          fullWidth
          slotProps={field.type === 'date'
            ? { inputLabel: { shrink: true }, htmlInput: { onClick: openNativePicker } }
            : undefined}
        />
      ))}
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
      </Box>
    </Box>
  );
}
