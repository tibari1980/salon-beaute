import { useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        setSearchResult(null);

        try {
            const q = query(collection(db, 'users'), where('email', '==', email.trim()));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setMsg({ type: 'error', text: 'Aucun utilisateur trouvé avec cet email.' });
            } else {
                const userDoc = snapshot.docs[0];
                setSearchResult({ id: userDoc.id, ...userDoc.data() });
            }
        } catch (error) {
            console.error(error);
            setMsg({ type: 'error', text: 'Erreur lors de la recherche.' });
        } finally {
            setLoading(false);
        }
    };

    const toggleAdmin = async (targetUser) => {
        if (targetUser.email === currentUser.email) {
            setMsg({ type: 'error', text: 'Vous ne pouvez pas modifier votre propre rôle.' });
            return;
        }

        const newRole = targetUser.role === 'admin' ? 'client' : 'admin';
        if (!window.confirm(`Voulez-vous vraiment passer ${targetUser.name || targetUser.email} en ${newRole} ?`)) return;

        try {
            await updateDoc(doc(db, 'users', targetUser.id), { role: newRole });
            setSearchResult({ ...targetUser, role: newRole });
            setMsg({ type: 'success', text: `Rôle mis à jour avec succès : ${newRole}` });
        } catch (error) {
            console.error(error);
            setMsg({ type: 'error', text: 'Erreur lors de la mise à jour.' });
        }
    };

    return (
        <div className="admin-page">
            <h2 style={{ marginBottom: '2rem' }}>Gestion des Rôles Admin</h2>

            <div className="profile-card" style={{ maxWidth: '600px' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--color-gray-400)' }}>
                    Recherchez un utilisateur par email pour lui attribuer ou retirer le rôle d'administrateur.
                </p>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="email"
                        placeholder="Email de l'utilisateur"
                        className="form-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '...' : 'Rechercher'}
                    </button>
                </form>

                {msg.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        background: msg.type === 'error' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                        color: msg.type === 'error' ? '#f87171' : '#4ade80'
                    }}>
                        {msg.text}
                    </div>
                )}

                {searchResult && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{searchResult.name || 'Utilisateur'}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-400)' }}>{searchResult.email}</div>
                            <div style={{ marginTop: '0.5rem' }}>
                                Rôle actuel : <span style={{ color: searchResult.role === 'admin' ? 'var(--color-gold)' : '#fff' }}>
                                    {searchResult.role === 'admin' ? '👑 Administrateur' : '👤 Client'}
                                </span>
                            </div>
                        </div>
                        <button
                            className={`btn btn-sm ${searchResult.role === 'admin' ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => toggleAdmin(searchResult)}
                        >
                            {searchResult.role === 'admin' ? 'Retirer Admin' : 'Passer Admin'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
