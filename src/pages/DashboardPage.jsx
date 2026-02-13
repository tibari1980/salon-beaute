import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate('/connexion');
                return;
            }
            setUser(currentUser);
            await loadAppointments();
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const loadAppointments = async () => {
        try {
            const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setAppointments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error('Error loading appointments:', err);
        }
    };

    const deleteAppointment = async (id) => {
        if (window.confirm(t('dashboard.delete') + ' ?')) {
            await deleteDoc(doc(db, 'appointments', id));
            setAppointments(appointments.filter((a) => a.id !== id));
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const todayAppointments = appointments.filter(
        (a) => a.date === new Date().toISOString().split('T')[0]
    );

    const totalRevenue = appointments.reduce((sum, a) => sum + (a.servicePrice || 0), 0);

    const formatCurrency = (amount) => {
        return `${amount} ${i18n.language === 'ar' ? 'درهم' : 'Dhs'}`;
    };

    const servicesList = [
        { id: 'coupe', price: 200, duration: '45 min', category: 'Coiffure' },
        { id: 'coloration', price: 450, duration: '90 min', category: 'Coloration' },
        { id: 'soin', price: 350, duration: '60 min', category: 'Soins' },
        { id: 'manucure', price: 150, duration: '50 min', category: 'Manucure' },
        { id: 'maquillage', price: 350, duration: '45 min', category: 'Maquillage' },
        { id: 'pedicure', price: 200, duration: '55 min', category: 'Pédicure' },
    ];

    const teamList = [
        { name: 'Sophie Laurent', roleId: 'coiffeuse', status: 'available' },
        { name: 'Marc Dubois', roleId: 'barbier', status: 'busy' },
        { name: 'Amira Benali', roleId: 'estheticienne', status: 'available' },
        { name: 'Clara Martin', roleId: 'manucuriste', status: 'break' },
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--color-gray-500)' }}>{t('profile.loading')}</p>
                </div>
            </div>
        );
    }

    // Helper for translation lookups
    const getServiceTitle = (id, fallbackName) => {
        // Try to find translation for ID, otherwise use fallback
        return id ? t(`booking.services.${id}`) : fallbackName;
    };

    const getStatusLabel = (status) => t(`dashboard.status.${status}`) || status;

    return (
        <div className={`dashboard ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <aside className="dashboard-sidebar">
                <div className="dashboard-sidebar-logo">Beauty<span>Connect</span></div>

                <div
                    className={`dashboard-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveNav('dashboard')}
                >
                    📊 {t('dashboard.overview')}
                </div>
                <div
                    className={`dashboard-nav-item ${activeNav === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveNav('appointments')}
                >
                    📅 {t('dashboard.appointments')}
                </div>
                <div
                    className={`dashboard-nav-item ${activeNav === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveNav('services')}
                >
                    💇 {t('dashboard.services')}
                </div>
                <div
                    className={`dashboard-nav-item ${activeNav === 'team' ? 'active' : ''}`}
                    onClick={() => setActiveNav('team')}
                >
                    👥 {t('dashboard.team')}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/" className="dashboard-nav-item">🏠 {t('dashboard.viewSite')}</Link>
                    <div className="dashboard-nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>🚪 {t('dashboard.logout')}</div>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        {activeNav === 'dashboard' && t('dashboard.overview')}
                        {activeNav === 'appointments' && t('dashboard.appointments')}
                        {activeNav === 'services' && t('dashboard.services')}
                        {activeNav === 'team' && t('dashboard.team')}
                    </h1>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                        {t('dashboard.welcome')} <span style={{ color: 'var(--color-gold)' }}>{user?.displayName || 'Admin'}</span>
                    </div>
                </div>

                {activeNav === 'dashboard' && (
                    <>
                        <div className="dashboard-stats">
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' }}>📅</div>
                                <div className="dashboard-stat-value">{appointments.length}</div>
                                <div className="dashboard-stat-label">{t('dashboard.statsTotal')}</div>
                                <div className="dashboard-stat-change positive">↑ {t('dashboard.active')}</div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}>📆</div>
                                <div className="dashboard-stat-value">{todayAppointments.length}</div>
                                <div className="dashboard-stat-label">{t('dashboard.statsToday')}</div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>💰</div>
                                <div className="dashboard-stat-value">{formatCurrency(totalRevenue)}</div>
                                <div className="dashboard-stat-label">{t('dashboard.statsRevenue')}</div>
                                <div className="dashboard-stat-change positive">↑ {t('dashboard.growth')}</div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>⭐</div>
                                <div className="dashboard-stat-value">4.9</div>
                                <div className="dashboard-stat-label">{t('dashboard.statsRating')}</div>
                            </div>
                        </div>

                        <div className="profile-card" style={{ marginTop: '1rem' }}>
                            <h3 className="profile-card-title">{t('dashboard.recent')}</h3>
                            {appointments.slice(0, 5).map((apt) => (
                                <div key={apt.id} className="appointment-item">
                                    <div>
                                        <div className="appointment-service">{getServiceTitle(apt.serviceId, apt.service)}</div>
                                        <div className="appointment-date">
                                            {apt.date} — {apt.time} — {apt.userName || 'Client'}
                                        </div>
                                    </div>
                                    <span className={`appointment-status ${apt.status}`}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeNav === 'appointments' && (
                    <div className="profile-card">
                        <h3 className="profile-card-title">{t('dashboard.allAppointments')} ({appointments.length})</h3>
                        {appointments.length === 0 ? (
                            <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>
                                {t('dashboard.empty')}
                            </p>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt.id} className="appointment-item">
                                    <div>
                                        <div className="appointment-service">{getServiceTitle(apt.serviceId, apt.service)}</div>
                                        <div className="appointment-date">
                                            {apt.date} — {apt.time} — {apt.userName || 'Client'} — {apt.professional}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className={`appointment-status ${apt.status}`}>
                                            {getStatusLabel(apt.status)}
                                        </span>
                                        <button
                                            onClick={() => deleteAppointment(apt.id)}
                                            style={{
                                                background: 'rgba(248, 113, 113, 0.1)',
                                                border: '1px solid rgba(248, 113, 113, 0.3)',
                                                color: '#f87171',
                                                padding: '4px 12px',
                                                borderRadius: '8px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {t('dashboard.delete')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeNav === 'services' && (
                    <div className="profile-card">
                        <h3 className="profile-card-title">{t('dashboard.serviceManagement')}</h3>
                        {servicesList.map((s, i) => (
                            <div key={i} className="appointment-item">
                                <div>
                                    <div className="appointment-service">{t(`booking.services.${s.id}`)}</div>
                                    <div className="appointment-date">{s.category} — {s.duration}</div>
                                </div>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(s.price)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeNav === 'team' && (
                    <div className="profile-card">
                        <h3 className="profile-card-title">{t('dashboard.teamManagement')}</h3>
                        {teamList.map((m, i) => (
                            <div key={i} className="appointment-item">
                                <div>
                                    <div className="appointment-service">{m.name}</div>
                                    <div className="appointment-date">{t(`booking.roles.${m.roleId}`)}</div>
                                </div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: m.status === 'available' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                    color: m.status === 'available' ? '#4ade80' : '#fbbf24',
                                }}>
                                    {getStatusLabel(m.status)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
