import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate('/connexion');
                return;
            }
            setUser(currentUser);

            try {
                const q = query(
                    collection(db, 'appointments'),
                    where('userId', '==', currentUser.uid)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                // Client-side sort to avoid index requirements
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAppointments(data);
            } catch (err) {
                console.error('Error loading appointments:', err);
                setError("Impossible de charger vos rendez-vous. Vérifiez votre connexion.");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profile-page">
                    <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>
                        <p style={{ color: 'var(--color-gray-500)' }}>Chargement...</p>
                    </div>
                </div>
            </>
        );
    }

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase()
        : '?';

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="container">
                    <div className="profile-header">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-info">
                            <h2>{user?.displayName || 'Client'}</h2>
                            <p>{user?.email}</p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                                Déconnexion
                            </button>
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-card">
                            <h3 className="profile-card-title">Mes rendez-vous</h3>
                            {error ? (
                                <p style={{ color: '#f87171', textAlign: 'center', padding: '2rem 0' }}>{error}</p>
                            ) : appointments.length === 0 ? (
                                <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>
                                    Aucun rendez-vous pour le moment.
                                </p>
                            ) : (
                                appointments.map((apt) => (
                                    <div key={apt.id} className="appointment-item">
                                        <div>
                                            <div className="appointment-service">{apt.service}</div>
                                            <div className="appointment-date">
                                                {apt.date} à {apt.time} — {apt.professional}
                                            </div>
                                        </div>
                                        <span className={`appointment-status ${apt.status}`}>
                                            {apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'pending' ? 'En attente' : 'Terminé'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="profile-card">
                            <h3 className="profile-card-title">Programme de fidélité</h3>
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{
                                    fontSize: '3rem',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 700,
                                    color: 'var(--color-gold)',
                                    marginBottom: '0.5rem',
                                }}>
                                    {appointments.length * 10}
                                </div>
                                <div style={{ color: 'var(--color-gray-400)', fontSize: '0.9rem' }}>Points de fidélité</div>
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-gold)',
                                    fontSize: '0.85rem',
                                }}>
                                    ✨ Prochain avantage à 100 points : -15% sur votre prochaine prestation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
