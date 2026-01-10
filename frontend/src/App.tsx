import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth'>('landing');
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  const handleNavigate = (page: 'landing' | 'auth', tab?: 'login' | 'signup') => {
    setCurrentPage(page);
    if (tab) {
      setAuthTab(tab);
    }
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'auth' && <AuthPortal onNavigate={handleNavigate} initialTab={authTab} />}
    </>
  );
}

export default App;
