import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';
import WaitlistPage from './components/WaitlistPage';
import TeamOnboarding from './components/TeamOnboarding';
import CreateTeam from './components/CreateTeam';
import JoinTeam from './components/JoinTeam';
import Dashboard from './components/Dashboard';
import Vaults from './components/Vaults';
import ServiceTokens from './components/ServiceTokens';
import VaultDetail from './components/VaultDetail';
import AuditLogs from './components/AuditLogs';
import TeamSettings from './components/TeamSettings';
import UserSettings from './components/UserSettings';
import ProtectedLayout from './components/ProtectedLayout';
import MainLayout from './components/MainLayout';
import OnboardingLayout from './components/OnboardingLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/signup" element={<AuthPortal />} />
        <Route path="/waitlist" element={<WaitlistPage />} />

        {/* Protected Routes (Auth Required) */}
        <Route element={<ProtectedLayout />}>
          
          {/* Onboarding Routes (No Sidebar, Centered) */}
          <Route element={<OnboardingLayout />}>
             <Route path="/get-started" element={<TeamOnboarding />} />
             <Route path="/create-team" element={<CreateTeam />} />
             <Route path="/join-team" element={<JoinTeam />} />
             <Route path="/profile" element={<UserSettings />} />
          </Route>

          {/* Main App Routes (Sidebar + Team Enforcement) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vaults" element={<Vaults />} />
            <Route path="/vault/:id" element={<VaultDetail />} />
            <Route path="/service-tokens" element={<ServiceTokens />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<TeamSettings />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
