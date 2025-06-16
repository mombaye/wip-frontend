import { useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, close } = useSidebar(); // ✅ Utilisation de close()
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollLeft > 100 && isOpen) {
        close(); // ✅ Ferme la sidebar quand on scroll horizontalement
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isOpen, close]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar  toLogOut={handleLogout}/>
      <div
        ref={containerRef}
        className={`flex-1 flex flex-col transition-all duration-300 overflow-x-auto ${
          isOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
