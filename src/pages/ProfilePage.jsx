import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilePage() {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Edit State
    const [editingApt, setEditingApt] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

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
                setError(t('profile.errorLoad'));
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate, t]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('profile.actions.confirmDelete'))) return;

        try {
            await deleteDoc(doc(db, 'appointments', id));
            setAppointments(appointments.filter(a => a.id !== id));
            setSuccessMsg(t('profile.actions.successDelete'));
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Error deleting appointment:", err);
            setError("Error deleting appointment");
        }
    };

    const openEditModal = (apt) => {
        setEditingApt(apt);
        setNewDate(apt.date);
        setNewTime(apt.time);
    };

    const handleSaveEdit = async () => {
        if (!editingApt) return;

        try {
            const aptRef = doc(db, 'appointments', editingApt.id);
            await updateDoc(aptRef, {
                date: newDate,
                time: newTime
            });

            // Update local state
            setAppointments(appointments.map(a =>
                a.id === editingApt.id ? { ...a, date: newDate, time: newTime } : a
            ));

            setEditingApt(null);
            setSuccessMsg(t('profile.actions.successUpdate'));
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error("Error updating appointment:", err);
            setError("Error updating appointment");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="profile-page">
                    <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>
                        <p style={{ color: 'var(--color-gray-500)' }}>{t('profile.loading')}</p>
                    </div>
                </div>
            </>
        );
    }

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase()
        : '?';

    // Helper to translate status
    const getStatusLabel = (status) => {
        return t(`profile.status.${status}`) || status;
    };

    return (
        <>
            <Navbar />
            <div className={`profile-page ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="container">
                    <div className="profile-header">
                        <div className="profile-avatar">{initials}</div>
                        <div className="profile-info">
                            <h2>{user?.displayName || 'Client'}</h2>
                            <p>{user?.email}</p>
                        </div>
                        <div style={{ marginLeft: i18n.language === 'ar' ? 0 : 'auto', marginRight: i18n.language === 'ar' ? 'auto' : 0 }}>
                            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                                {t('profile.logout')}
                            </button>
                        </div>
                    </div>

                    {successMsg && (
                        <div style={{
                            background: 'rgba(74, 222, 128, 0.1)',
                            color: '#4ade80',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }}>
                            {successMsg}
                        </div>
                    )}

                    <div className="profile-grid">
                        <div className="profile-card">
                            <h3 className="profile-card-title">{t('profile.appointments')}</h3>
                            {error ? (
                                <p style={{ color: '#f87171', textAlign: 'center', padding: '2rem 0' }}>{error}</p>
                            ) : appointments.length === 0 ? (
                                <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '2rem 0' }}>
                                    {t('profile.noAppointments')}
                                </p>
                            ) : (
                                appointments.map((apt) => (
                                    <div key={apt.id} className="appointment-item">
                                        <div style={{ flex: 1 }}>
                                            <div className="appointment-service">{apt.service}</div>
                                            <div className="appointment-date">
                                                {apt.date} — {apt.time} — {apt.professional}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                            <span className={`appointment-status ${apt.status}`}>
                                                {getStatusLabel(apt.status)}
                                            </span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => openEditModal(apt)}
                                                    className="btn btn-sm"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#333' }}
                                                >
                                                    ✎ {t('profile.actions.edit')}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(apt.id)}
                                                    className="btn btn-sm"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}
                                                >
                                                    ✕ {t('profile.actions.delete')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="profile-card">
                            <h3 className="profile-card-title">{t('profile.loyaltyProgram')}</h3>
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
                                <div style={{ color: 'var(--color-gray-400)', fontSize: '0.9rem' }}>{t('profile.loyaltyPoints')}</div>
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-gold)',
                                    fontSize: '0.85rem',
                                }}>
                                    {t('profile.nextReward')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingApt && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'var(--color-surface)',
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            width: '90%',
                            maxWidth: '400px',
                            border: '1px solid var(--color-gold-dim)'
                        }}>
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gold)' }}>
                                {t('profile.editTitle')}
                            </h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gray-300)' }}>
                                    {t('profile.newDate')}
                                </label>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gray-300)' }}>
                                    {t('profile.newTime')}
                                </label>
                                <select
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%' }}
                                >
                                    {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setEditingApt(null)}
                                    className="btn btn-ghost"
                                >
                                    {t('profile.actions.cancel')}
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="btn btn-primary"
                                >
                                    {t('profile.actions.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
