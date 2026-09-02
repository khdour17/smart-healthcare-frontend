import { useContext } from 'react';

import { ToastContext } from '../contexts/ToastContext';

export function useToast(): (message: string) => void {
  const context = useContext(ToastContext);
  return context?.showToast ?? (() => {});
}
