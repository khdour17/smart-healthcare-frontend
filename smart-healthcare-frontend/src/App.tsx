import {
  Box,
  Button,
  Typography,
} from '@mui/material';

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Smart Healthcare Appointment System
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Theme test — this should look dark, not the Vite default.
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
}

export default App;