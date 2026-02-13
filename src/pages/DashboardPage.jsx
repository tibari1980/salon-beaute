import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function DashboardPage() {
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
        if (window.confirm('Supprimer ce rendez-vous ?')) {
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

    if (loading) {
        return (
            <div className="dashboard">
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--color-gray-500)' }}>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <aside className="dashboard-sidebar">
                <div className="dashboard-sidebar-logo">Beauty<span>Connect</span></div>

                <div
                    className={`dashboard-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveNav('dashboard')}
                >
                    📊 Tableau de bord
                </div>
                <div
                    className={`dashboard-nav-item ${activeNav === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveNav('appointments')}
                >
                    📅 Rendez-vous
                </div>
                <div
                    className={`dashboard-nav-item ${activeNav === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveNav('services')}
                >
                    💇 Services
                </div>
                <div
                    className={`dashboard-nav-item ${activeNav === 'team' ? 'active' : ''}`}
                    onClick={() => setActiveNav('team')}
                >
                    👥 Équipe
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to="/" className="dashboard-nav-item">🏠 Voir le site</Link>
                    <div className="dashboard-nav-item" onClick={handleLogout}>🚪 Déconnexion</div>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        {activeNav === 'dashboard' && 'Tableau de bord'}
                        {activeNav === 'appointments' && 'Rendez-vous'}
                        {activeNav === 'services' && 'Services'}
                        {activeNav === 'team' && 'Équipe'}
                    </h1>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                        Bonjour, <span style={{ color: 'var(--color-gold)' }}>{user?.displayName || 'Admin'}</span>
                    </div>
                </div>

                {activeNav === 'dashboard' && (
                    <>
                        <div className="dashboard-stats">
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' }}>📅</div>
                                <div className="dashboard-stat-value">{appointments.length}</div>
                                <div className="dashboard-stat-label">Total rendez-vous</div>
                                <div className="dashboard-stat-change positive">↑ Actif</div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}>📆</div>
                                <div className="dashboard-stat-value">{todayAppointments.length}</div>
                                <div className="dashboard-stat-label">Aujourd'hui</div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa' }}>💰</div>
                                <div className="dashboard-stat-value">{totalRevenue} Dhs</div>
                                <div className="dashboard-stat-label">Revenus totaux</div>
                                <div className="dashboard-stat-change positive">↑ En croissance</div>
                            </div>
                            <div className="dashboard-stat-card">
                                <div className="dashboard-stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>⭐</div>
                                <div className="dashboard-stat-value">4.9</div>
                                <div className="dashboard-stat-label">Note moyenne</div>
                            </div>
                        </div>

                        <div className="profile-card" style={{ marginTop: '1rem' }}>
                            <h3 className="profile-card-title">Rendez-vous récents</h3>
                            {appointments.slice(0, 5).map((apt) => (
                                <div key={apt.id} className="appointment-item">
                                    <div>
                                        <div className="appointment-service">{apt.service}</div>
                                        <div className="appointment-date">
                                            {apt.date} à {apt.time} — {apt.userName || 'Client'} avec {apt.professional}
                                        </div>
                                    </div>
                                    <span className={`appointment-status ${apt.status}`}>
                                        {apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'pending' ? 'En attente' : 'Terminé'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeNav === 'appointments' && (
                    <div className="profile-card">
                        <h3 className="profile-card-title">Tous les rendez-vous ({appointments.length})</h3>
                        {appointments.length === 0 ? (
                            <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>
                                Aucun rendez-vous.
                            </p>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt.id} className="appointment-item">
                                    <div>
                                        <div className="appointment-service">{apt.service}</div>
                                        <div className="appointment-date">
                                            {apt.date} à {apt.time} — {apt.userName || 'Client'} avec {apt.professional}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className={`appointment-status ${apt.status}`}>
                                            {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
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
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeNav === 'services' && (
                    <div className="profile-card">
                        <h3 className="profile-card-title">Gestion des services</h3>
                        {[
                            { name: 'Coupe & Brushing', price: '200 Dhs', duration: '45 min', category: 'Coiffure' },
                            { name: 'Coloration & Balayage', price: '450 Dhs', duration: '90 min', category: 'Coloration' },
                            { name: 'Soin Éclat Premium', price: '350 Dhs', duration: '60 min', category: 'Soins' },
                            { name: 'Manucure Prestige', price: '150 Dhs', duration: '50 min', category: 'Manucure' },
                            { name: 'Maquillage Événement', price: '350 Dhs', duration: '45 min', category: 'Maquillage' },
                            { name: 'Pédicure Spa', price: '200 Dhs', duration: '55 min', category: 'Pédicure' },
                        ].map((s, i) => (
                            <div key={i} className="appointment-item">
                                <div>
                                    <div className="appointment-service">{s.name}</div>
                                    <div className="appointment-date">{s.category} — {s.duration}</div>
                                </div>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{s.price}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeNav === 'team' && (
                    <div className="profile-card">
                        <h3 className="profile-card-title">Équipe</h3>
                        {[
                            { name: 'Sophie Laurent', role: 'Coiffeuse Styliste', status: 'Disponible' },
                            { name: 'Marc Dubois', role: 'Barbier Expert', status: 'En rendez-vous' },
                            { name: 'Amira Benali', role: 'Esthéticienne', status: 'Disponible' },
                            { name: 'Clara Martin', role: 'Manucuriste', status: 'En pause' },
                        ].map((m, i) => (
                            <div key={i} className="appointment-item">
                                <div>
                                    <div className="appointment-service">{m.name}</div>
                                    <div className="appointment-date">{m.role}</div>
                                </div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: m.status === 'Disponible' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                    color: m.status === 'Disponible' ? '#4ade80' : '#fbbf24',
                                }}>
                                    {m.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
