import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';

export default function AdminAppointments() {
    const { t } = useTranslation();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) return;
        try {
            await deleteDoc(doc(db, 'appointments', id));
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'appointments', id), { status: newStatus });
            setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredAppointments = appointments.filter(a => {
        const matchesStatus = filter === 'all' || a.status === filter;
        const matchesSearch =
            (a.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (a.userEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (a.ref?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusLabel = (status) => t(`dashboard.status.${status}`) || status;

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Gestion des Rendez-vous</h2>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        Total: {filteredAppointments.length}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Rechercher (Nom, Email, Réf...)"
                        className="form-input"
                        style={{ flex: 1, minWidth: '200px' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="form-input"
                        style={{ width: '200px' }}
                    >
                        <option value="all" style={{ color: '#000' }}>{t('dashboard.allAppointments')}</option>
                        <option value="confirmed" style={{ color: '#000' }}>{t('dashboard.status.confirmed')}</option>
                        <option value="completed" style={{ color: '#000' }}>{t('dashboard.status.completed')}</option>
                        <option value="cancelled" style={{ color: '#000' }}>{t('dashboard.status.cancelled')}</option>
                    </select>
                </div>
            </div>

            <div className="profile-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Client</th>
                            <th style={{ padding: '1rem' }}>Service</th>
                            <th style={{ padding: '1rem' }}>Date & Heure</th>
                            <th style={{ padding: '1rem' }}>Expert</th>
                            <th style={{ padding: '1rem' }}>Statut</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(apt => (
                            <tr key={apt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div>{apt.userName}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{apt.userEmail}</div>
                                    {apt.ref && <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>Ref: {apt.ref}</div>}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {apt.service}
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{apt.servicePrice} Dhs</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div>{apt.date}</div>
                                    <div style={{ fontSize: '0.9rem' }}>{apt.time}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{apt.professional}</td>
                                <td style={{ padding: '1rem' }}>
                                    <select
                                        value={apt.status}
                                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                                        className="form-select"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'var(--color-text)',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            width: '100%',
                                            minWidth: '120px'
                                        }}
                                    >
                                        <option value="confirmed" style={{ color: '#000' }}>{t('dashboard.status.confirmed')}</option>
                                        <option value="completed" style={{ color: '#000' }}>{t('dashboard.status.completed')}</option>
                                        <option value="cancelled" style={{ color: '#000' }}>{t('dashboard.status.cancelled')}</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => handleDelete(apt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>Aucun rendez-vous trouvé.</div>
                )}
            </div>
        </div>
    );
}
