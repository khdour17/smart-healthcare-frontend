import { useOutletContext } from 'react-router-dom';

export interface LayoutSettings {
  isMenuCollapsed: boolean;
  setMenuCollapsed: (collapsed: boolean) => void;
}

export function useLayoutSettings(): LayoutSettings {
  return useOutletContext<LayoutSettings>();
}
