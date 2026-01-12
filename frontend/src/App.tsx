import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';
import TeamOnboarding from './components/TeamOnboarding';
import CreateTeam from './components/CreateTeam';
import JoinTeam from './components/JoinTeam';
import Dashboard from './components/Dashboard';
import Vaults from './components/Vaults';
import ServiceTokens from './components/ServiceTokens';
import VaultDetail from './components/VaultDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/signup" element={<AuthPortal />} />
        <Route path="/get-started" element={<TeamOnboarding />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/join-team" element={<JoinTeam />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vaults" element={<Vaults />} />
        <Route path="/vault/:id" element={<VaultDetail />} />
        <Route path="/service-tokens" element={<ServiceTokens />} />
      </Routes>
    </Router>
  );
}

export default App;
