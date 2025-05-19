import { Home, Calculator, CheckCircle, BarChart3, Map, Settings, Menu, X, User, Users, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import camusat from '@/assets/images/camusat-logo.png';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/calculs-wip', label: 'Calculs du WIP', icon: Calculator },
  { path: '/closing-check', label: 'Closing Check', icon: CheckCircle },
  { path: '/wip', label: 'WIP', icon: BarChart3 },
  { path: '/mapping', label: 'Mapping', icon: Map },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: Users },
  { path: '/parametres', label: 'Paramètres', icon: Settings },
  
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="text-blue-900" /> : <Menu className="text-blue-900" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          open ? 'block' : 'hidden'
        } lg:block w-64 bg-white shadow-xl p-4 fixed top-0 left-0 h-full z-40 `}
      >
        <div className="mb-6 text-center">
          <img src={camusat} alt="Logo Camusat" className="w-12 mx-auto mb-2" />
          <h1 className="font-bold text-lg text-blue-900">WIP Digital</h1>
        </div>

        <nav className="space-y-2 mb-6">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-50 transition font-medium ${
                location.pathname === path ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

       <div className="absolute bottom-6 left-0 w-full text-center">
            <User className="mx-auto mb-1 text-gray-500" />
            <p className="text-sm text-gray-700">{user?.email}</p>
            <button
                onClick={logout}
                className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center justify-center mx-auto gap-1"
            >
                <LogOut size={14} />
                Déconnexion
            </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
