import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
    const { t, i18n } = useTranslation();
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/connexion');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`dashboard ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <aside className="dashboard-sidebar">
                <div className="dashboard-sidebar-logo">Beauty<span>Admin</span></div>

                <Link
                    to="/admin"
                    className={`dashboard-nav-item ${isActive('/admin') ? 'active' : ''}`}
                >
                    📊 {t('dashboard.overview')}
                </Link>

                <Link
                    to="/admin/appointments"
                    className={`dashboard-nav-item ${isActive('/admin/appointments') ? 'active' : ''}`}
                >
                    📅 {t('dashboard.appointments')}
                </Link>

                <Link
                    to="/admin/services"
                    className={`dashboard-nav-item ${isActive('/admin/services') ? 'active' : ''}`}
                >
                    💇 {t('dashboard.services')}
                </Link>

                <Link
                    to="/admin/users"
                    className={`dashboard-nav-item ${isActive('/admin/users') ? 'active' : ''}`}
                >
                    👥 {t('dashboard.clients')}
                </Link>

                <Link
                    to="/admin/team"
                    className={`dashboard-nav-item ${isActive('/admin/team') ? 'active' : ''}`}
                >
                    💇‍♀️ {t('dashboard.team')}
                </Link>

                <Link
                    to="/admin/reviews"
                    className={`dashboard-nav-item ${isActive('/admin/reviews') ? 'active' : ''}`}
                >
                    ⭐ Avis
                </Link>

                <Link
                    to="/admin/settings"
                    className={`dashboard-nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
                >
                    ⚙️ Gestion Admin
                </Link>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/" className="dashboard-nav-item">🏠 {t('dashboard.viewSite')}</Link>
                    <button
                        onClick={handleLogout}
                        className="dashboard-nav-item"
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        🚪 {t('dashboard.logout')}
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        {isActive('/admin') && t('dashboard.overview')}
                        {isActive('/admin/appointments') && t('dashboard.appointments')}
                        {isActive('/admin/services') && t('dashboard.services')}
                        {isActive('/admin/users') && t('dashboard.clients')}
                        {isActive('/admin/team') && t('dashboard.team')}
                    </h1>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                        {t('dashboard.welcome')} <span style={{ color: 'var(--color-gold)' }}>{currentUser?.email}</span>
                    </div>
                </div>

                <Outlet />
            </main>
        </div>
    );
}
