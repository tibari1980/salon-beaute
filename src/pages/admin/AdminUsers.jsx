import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(newRole === 'admin' ? "Voulez-vous vraiment nommer cet utilisateur administrateur ?" : "Voulez-vous retirer les droits d'administration ?")) return;

        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Erreur lors de la mise à jour du rôle.");
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-page">
            <h2 style={{ marginBottom: '2rem' }}>Gestion des Clients</h2>

            <div className="profile-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Nom</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Téléphone</th>
                            <th style={{ padding: '1rem' }}>Inscrit le</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>
                                        {user.role === 'admin' ? '👑 Admin' : 'Client'}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>{user.phone || '-'}</td>
                                <td style={{ padding: '1rem' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    {user.role === 'admin' ? (
                                        <button
                                            onClick={() => handleRoleChange(user.id, 'client')}
                                            className="btn btn-outline btn-sm"
                                            style={{ borderColor: '#f87171', color: '#f87171', fontSize: '0.8rem' }}
                                        >
                                            Retirer Admin
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRoleChange(user.id, 'admin')}
                                            className="btn btn-outline btn-sm"
                                            style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontSize: '0.8rem' }}
                                        >
                                            Promouvoir Admin
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
