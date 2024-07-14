import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { Router } from './Router';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RouteProvider } from './context/RouteContext';
import { UserProvider } from './context/UserContext';
import { Sidebar } from './components/Sidebar';
import { useDarkTheme } from "./context/DarkThemeContext";

function App() {
  const { isLoggedIn, logout } = useAuth();
  const { isDark } = useDarkTheme();
  const navigate = useNavigate();

  function handleLogout(){
    Cookies.remove("token")
    localStorage.removeItem("token")
    navigate("/", {replace: true})
  }
  
  useEffect(() => {
    const token = Cookies.get('token');
    const tokenLS = localStorage.getItem("token")
    if (!token || tokenLS == null) {
      logout();
      navigate('/',  {replace: true});
    }
  }, [ isLoggedIn && navigate, logout]);


  return (
    <UserProvider>
      <RouteProvider>
          <div className={`md:flex  h-[100vh] w-[100vw] ${isDark && 'dark'}`}>
            {isLoggedIn ? (
              <>
                <Sidebar handlelogout={handleLogout}/>
                <div className="flex flex-col bg-[#ECECEE] flex-1 overflow-hidden dark:bg-[#28292B]">
                  <div className="flex-1 p-6 overflow-y-auto no-scrollbar dark:bg-[#28292B]">
                    <Router />
                  </div>
                </div>
              </>
            ) : (
              <Router />
            )}
          </div>
      </RouteProvider>
    </UserProvider>
  );
}

export default App;
