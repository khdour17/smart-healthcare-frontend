import {
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Snackbar,
} from '@mui/material';

import { ToastContext } from './ToastContext';

const AUTO_HIDE_MS = 3200;

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((text: string) => setMessage(text), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={message !== null}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
