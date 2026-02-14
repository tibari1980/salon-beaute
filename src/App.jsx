import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './components/layouts/AdminLayout';
import AdminRoute from './components/auth/AdminRoute';
import AdminServices from './pages/admin/AdminServices';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminUsers from './pages/admin/AdminUsers';

import ForgotPasswordPage from './pages/ForgotPasswordPage';

export default function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', i18n.language);
    }, [i18n.language]);

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
                <Route path="/reservation" element={<BookingPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="appointments" element={<AdminAppointments />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}
