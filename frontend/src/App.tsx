import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPortal from './components/AuthPortal';
import TeamOnboarding from './components/TeamOnboarding';
import CreateTeam from './components/CreateTeam';
import JoinTeam from './components/JoinTeam';

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
      </Routes>
    </Router>
  );
}

export default App;
