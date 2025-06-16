import { useSidebar } from '@/contexts/SidebarContext';
import { ChevronLeft, ChevronRight, Home, Calculator, CheckCircle, BarChart3, Map, Settings, Users, LogOut, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import camusat from '@/assets/images/camusat-logo.png';
import { motion } from 'framer-motion';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/calculs-wip', label: 'Generate Audit Trial', icon: Calculator },
  { path: '/closing-check', label: 'Closing Check', icon: CheckCircle },
  { path: '/wip', label: 'WIP', icon: BarChart3, soon: true },
  { path: '/mapping', label: 'Mapping', icon: Map },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: Users },
  { path: '/parametres', label: 'Paramètres', icon: Settings },
];


type SidebarProps = {
  toLogOut: () => void; // fonction sans argument qui ne retourne rien
};


const Sidebar: React.FC<SidebarProps> = ({ toLogOut }) => {
  const location = useLocation();
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggle}>
          {isOpen ? <X className="text-blue-900" /> : <Menu className="text-blue-900" />}
        </button>
      </div>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`lg:block bg-white shadow-xl p-4 fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <img src={camusat} alt="Logo Camusat" className={`mb-2 ${isOpen ? 'w-12' : 'w-8'} transition-all`} />
            {isOpen && <h1 className="font-bold text-lg text-blue-900">WIP Digital</h1>}
          </div>
          <button
            onClick={toggle}
            className="text-gray-400 hover:text-blue-600 transition hidden lg:block"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {isOpen && <p className="text-xs uppercase text-gray-400 px-4 mb-2">Navigation</p>}
        <nav className="space-y-2 mb-6">
          {menuItems.map(({ path, label, icon: Icon, soon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => isOpen === false && toggle()}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition font-medium relative ${
                location.pathname === path
                  ? 'bg-blue-100 text-blue-900 font-semibold border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <Icon size={20} />
              {isOpen && label}
              {soon && isOpen && (
                <span className="absolute right-4 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Bientôt
                </span>
              )}
            </Link>
          ))}
        </nav>

        <hr className="my-4 border-gray-200" />

        <div className={`absolute bottom-6 left-0 w-full text-center ${isOpen ? '' : 'text-xs'}`}>
          <User className="mx-auto mb-1 text-gray-500" />
          {isOpen ? (
            <>
              <p className="text-sm text-gray-700">user@example.com</p>
              <button
                className="mt-2 text-xs text-red-500 hover:bg-red-100 px-2 py-1 rounded flex items-center justify-center mx-auto gap-1 transition"
                 onClick={toLogOut}
              >
                <LogOut size={14} />
                Déconnexion
              </button>
            </>
          ) : (
            <button className="text-red-500 hover:text-red-700">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;