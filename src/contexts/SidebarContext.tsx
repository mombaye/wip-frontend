import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}>({
  isOpen: true,
  toggle: () => {},
  close: () => {},
  open: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true); // ✅ nouvelle fonction

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
