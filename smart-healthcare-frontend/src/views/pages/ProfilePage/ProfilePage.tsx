import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import EditIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';

import { getAdminById } from '../../../api/admin/AdminAPI';
import {
  getDoctorById,
  updateDoctor,
} from '../../../api/doctors/DoctorsAPI';
import {
  getPatientById,
  updatePatient,
} from '../../../api/patients/PatientsAPI';
import { Drawer } from '../../../components/Drawer/Drawer';
import {
  type AuthUser,
  AuthContext,
} from '../../../contexts/AuthContext';
import {
  EditProfileForm,
  type ProfileField,
} from './EditProfileForm/EditProfileForm';
import styles from './ProfilePage.module.scss';

interface ProfileDetail {
  label: string;
  value: string;
}

interface Profile {
  details: ProfileDetail[];
  fields: ProfileField[];
}

const NOT_GIVEN = 'Not given';

async function loadProfile(user: AuthUser): Promise<Profile> {
  if (user.role === 'DOCTOR') {
    const doctor = await getDoctorById(user.roleEntityId);
    return {
      details: [
        { label: 'Full Name', value: doctor.name },
        { label: 'Specialty', value: doctor.specialty },
      ],
      fields: [
        { name: 'name', label: 'Full Name', value: doctor.name, required: true },
        { name: 'specialty', label: 'Specialty', value: doctor.specialty, required: true },
      ],
    };
  }

  if (user.role === 'PATIENT') {
    const patient = await getPatientById(user.roleEntityId);
    return {
      details: [
        { label: 'Full Name', value: patient.name },
        { label: 'Date of Birth', value: patient.dateOfBirth },
        { label: 'Phone', value: patient.phone || NOT_GIVEN },
        { label: 'Address', value: patient.address || NOT_GIVEN },
      ],
      fields: [
        { name: 'name', label: 'Full Name', value: patient.name, required: true },
        { name: 'dateOfBirth', label: 'Date of Birth', value: patient.dateOfBirth, type: 'date', required: true },
        { name: 'phone', label: 'Phone', value: patient.phone ?? '' },
        { name: 'address', label: 'Address', value: patient.address ?? '' },
      ],
    };
  }

  const admin = await getAdminById(user.roleEntityId);
  return {
    details: [
      { label: 'Full Name', value: admin.name },
      { label: 'Department', value: admin.department },
    ],
    fields: [],
  };
}

async function saveProfile(user: AuthUser, values: Record<string, string>): Promise<void> {
  if (user.role === 'DOCTOR') {
    await updateDoctor(user.roleEntityId, {
      name: values.name,
      specialty: values.specialty,
    });
    return;
  }

  await updatePatient(user.roleEntityId, {
    name: values.name,
    dateOfBirth: values.dateOfBirth,
    phone: values.phone || undefined,
    address: values.address || undefined,
  });
}

export default function ProfilePage() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshProfile = useCallback(() => {
    if (user === null) return;
    loadProfile(user)
      .then((loaded) => {
        setProfile(loaded);
        setError(null);
      })
      .catch(() => setError('Could not load your profile. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  function handleSaved() {
    setIsDrawerOpen(false);
    refreshProfile();
  }

  const accountDetails: ProfileDetail[] = user === null ? [] : [
    { label: 'Username', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
  ];

  const canEdit = profile !== null && profile.fields.length > 0;

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Profile</Typography>
        {canEdit && (
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsDrawerOpen(true)}>Edit Profile</Button>
        )}
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Account</Typography>
        <Box className={styles.details}>
          {accountDetails.map((detail) => (
            <Box key={detail.label} className={styles.detail}>
              <Typography variant="body2" color="textSecondary">{detail.label}</Typography>
              <Typography variant="body1" className={styles.detailValue}>{detail.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {isLoading && (
        <Typography className={styles.message} color="textSecondary">Loading your profile...</Typography>
      )}

      {!isLoading && error !== null && (
        <Typography className={styles.message} color="error">{error}</Typography>
      )}

      {!isLoading && error === null && profile !== null && (
        <Box className={styles.section}>
          <Typography variant="h6">Details</Typography>
          <Box className={styles.details}>
            {profile.details.map((detail) => (
              <Box key={detail.label} className={styles.detail}>
                <Typography variant="body2" color="textSecondary">{detail.label}</Typography>
                <Typography variant="body1" className={styles.detailValue}>{detail.value}</Typography>
              </Box>
            ))}
          </Box>
          {!canEdit && (
            <Typography variant="body2" color="textSecondary">
              An admin account is changed by another admin from the Admins page.
            </Typography>
          )}
        </Box>
      )}

      {canEdit && user !== null && (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Edit Profile">
          <EditProfileForm
            fields={profile.fields}
            onSubmit={(values) => saveProfile(user, values)}
            onSuccess={handleSaved}
            onCancel={() => setIsDrawerOpen(false)}
          />
        </Drawer>
      )}
    </Box>
  );
}
