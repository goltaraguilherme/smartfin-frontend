import { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useAuth } from './context/AuthContext';
import { useRoute } from './context/RouteContext';

import Spread from './pages/Spread';
import Login from './pages/Login';
import Esqueci from './pages/Esqueci';
import Cadastro from './pages/Cadastro';
import NovaSenha from './pages/NovaSenha';
import { UserProvider } from './context/UserContext';
import AdminUsers from './pages/AdminUsers';
import AdminComments from './pages/AdminComments';

export function Router() {
  const location = useLocation();

  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();
  const { setCurrentRoute } = useRoute();

  useEffect(() => {
    const token = Cookies.get('token');
    const tokenLS = localStorage.getItem('token')
    if (token && tokenLS) {
      login();
    } else {
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  const handleLogin = () => {
    login();
    navigate('/');
    window.location.reload()
  };

  return (
    <UserProvider>
      <Routes>
        {!isLoggedIn ? 
          <>
            <Route path="/" element={<Login handleLogin={handleLogin} />} />
            <Route path="/esqueci" element={<Esqueci />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci/nova-senha/" element={<NovaSenha />} />
          </>
          : 
          <>
            <Route path="/" element={<Spread />} />
            <Route path="/admin_users" element={<AdminUsers />} />
            <Route path="/admin_comments" element={<AdminComments />} />
          </>
        }
      </Routes>
    </UserProvider>
  );
}