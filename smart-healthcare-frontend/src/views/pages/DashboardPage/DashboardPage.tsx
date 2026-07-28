import { useContext } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { AuthContext } from '../../../contexts/AuthContext';
import styles from './DashboardPage.module.scss';

export default function DashboardPage() {
  const auth = useContext(AuthContext);
  const role = auth?.user?.role;

  return (
    <Box className={styles.root}>
      <Typography variant="h4">Welcome, {auth?.user?.username}</Typography>
      <Typography color="text.secondary">
        {role === 'ADMIN' && 'Manage doctors, patients, and users from the sidebar.'}
        {role === 'DOCTOR' && 'View your appointments and patients from the sidebar.'}
        {role === 'PATIENT' && 'Book and manage your appointments from the sidebar.'}
      </Typography>
    </Box>
  );
}