import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
    const { t, i18n } = useTranslation();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setAppointments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error('Error loading appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const todayAppointments = appointments.filter(
        (a) => a.date === new Date().toISOString().split('T')[0]
    );

    const totalRevenue = appointments.reduce((sum, a) => sum + (a.servicePrice || 0), 0);

    const formatCurrency = (amount) => {
        return `${amount} ${i18n.language === 'ar' ? 'درهم' : 'Dhs'}`;
    };

    // Helper for translation lookups
    // Helper for translation lookups
    const getServiceTitle = (id, fallbackName) => {
        if (id) {
            const key = `booking.services.${id}`;
            const translated = t(key);
            return translated !== key ? translated : id;
        }
        // Fallback for stored strings that might be keys
        if (fallbackName && fallbackName.startsWith('booking.services.')) {
            const key = fallbackName;
            const translated = t(key);
            return translated !== key ? translated : key.split('.').pop();
        }
        return fallbackName;
    };

    const getStatusLabel = (status) => t(`dashboard.status.${status}`) || status;

    if (loading) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ color: 'var(--color-gray-500)' }}>{t('profile.loading')}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
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

            <div className="profile-card" style={{ marginTop: '2rem' }}>
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
        </div>
    );
}
