import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/PersonOutlined';
import {
  Box,
  Button,
  Switch,
  Typography,
} from '@mui/material';

import {
  type StatTile,
  StatTiles,
} from '../../../components/StatTiles/StatTiles';
import { AuthContext } from '../../../contexts/AuthContext';
import {
  getSessionExpiry,
  getToken,
} from '../../../utils/authStorage';
import { useLayoutSettings } from '../../layouts/MainLayout/layoutSettings';
import { PageHeader } from '../../../components/PageHeader/PageHeader';
import styles from './SettingsPage.module.scss';

function sessionEndsAt(): string {
  const token = getToken();
  const expiry = token === null ? null : getSessionExpiry(token);
  if (expiry === null) return 'Unknown';

  return `${expiry.toLocaleDateString()} at ${expiry.toTimeString().slice(0, 5)}`;
}

export default function SettingsPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isMenuCollapsed, setMenuCollapsed } = useLayoutSettings();

  const sessionDetails: StatTile[] = [
    { label: 'Signed in as', value: auth?.user?.username ?? 'Unknown' },
    { label: 'Role', value: auth?.user?.role ?? 'Unknown' },
    { label: 'Email', value: auth?.user?.email ?? 'Unknown' },
    { label: 'Session ends', value: sessionEndsAt() },
  ];

  return (
    <Box className={styles.page}>
      <PageHeader title="Settings" subtitle="Your session and how the app behaves." />

      <Box className={styles.section}>
        <Typography variant="h6">Appearance</Typography>
        <Box className={styles.setting}>
          <Box className={styles.settingText}>
            <Typography variant="body1">Keep the side menu collapsed</Typography>
            <Typography variant="body2" color="textSecondary">
              The menu stays narrow on every page until you turn this off.
            </Typography>
          </Box>
          <Switch
            checked={isMenuCollapsed}
            onChange={(event) => setMenuCollapsed(event.target.checked)}
            slotProps={{ input: { 'aria-label': 'Keep the side menu collapsed' } }}
          />
        </Box>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Session</Typography>
        <StatTiles tiles={sessionDetails} />
        <Typography variant="body2" color="textSecondary">
          You are signed out automatically once the session ends. Use Logout in the header to sign out now.
        </Typography>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h6">Account</Typography>
        <Typography variant="body2" color="textSecondary">
          Your name and the rest of your details live on the profile page.
        </Typography>
        <Box>
          <Button variant="contained" startIcon={<PersonIcon />} onClick={() => navigate('/dashboard/profile')}>Go to Profile</Button>
        </Box>
      </Box>
    </Box>
  );
}
