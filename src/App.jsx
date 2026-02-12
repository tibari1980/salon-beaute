import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                <Route path="/reservation" element={<BookingPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/admin" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}
