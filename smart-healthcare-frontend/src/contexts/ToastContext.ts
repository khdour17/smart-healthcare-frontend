import { createContext } from 'react';

interface ToastContextValue {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
