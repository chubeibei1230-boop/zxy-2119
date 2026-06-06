import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from '@/pages/MainMenu';
import GamePage from '@/pages/GamePage';
import ResultPage from '@/pages/ResultPage';
import ReportPage from '@/pages/ReportPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}
