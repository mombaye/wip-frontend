// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import FirstLoginPage from '@/pages/FirstLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PrivateRoute from '@/routes/PrivateRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import UsersPage from '@/pages/UsersPage';
import MappingPage from '@/pages/MappingPage';


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/first-login" element={<FirstLoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Future routes */}
      <Route
        path="/calculs-wip"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Calculs du WIP</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/closing-check"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Closing Check</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/wip"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>WIP</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mapping"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <MappingPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />



      {/* User routes*/}
      <Route
        path="/utilisateurs"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/parametres"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <div>Paramètres</div>
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
