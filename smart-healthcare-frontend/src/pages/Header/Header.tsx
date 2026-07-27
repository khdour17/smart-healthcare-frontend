import {
  useContext,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

import logo from '../../assets/images/logo.png';
import { AuthContext } from '../../contexts/AuthContext';
import { clearSession } from '../../utils/authStorage';
import { getInitials } from '../../utils/getInitials';

export function Header() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function handleLogout() {
    setAnchorEl(null);
    clearSession();
    auth?.setUser(null);
    navigate('/login', { replace: true });
  }

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <Box component="img" src={logo} alt="Smart Healthcare logo" sx={{ height: 28, width: 28 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>Smart Healthcare</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>Appointment System</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">Hello {auth?.user?.username}</Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
              {getInitials(auth?.user?.username)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Change Password</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}