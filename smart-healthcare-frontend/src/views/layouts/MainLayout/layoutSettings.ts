import { useOutletContext } from 'react-router-dom';

interface LayoutSettings {
  isMenuCollapsed: boolean;
  setMenuCollapsed: (collapsed: boolean) => void;
}

export function useLayoutSettings(): LayoutSettings {
  return useOutletContext<LayoutSettings>();
}
