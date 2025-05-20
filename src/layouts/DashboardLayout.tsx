import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
