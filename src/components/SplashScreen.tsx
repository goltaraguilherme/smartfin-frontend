import { useEffect } from 'react';
import styles from './SplashScreen.module.css';

const SplashScreen = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = '/spread';
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#13141B]">
      <img className={styles.logo} src="/logo.png" alt="Logo" />
    </div>
  );
};

export default SplashScreen;
