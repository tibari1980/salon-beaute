import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';

// Hardcoded data for seeding
const INITIAL_TEAM = [
    {
        id: 'kenza',
        name: 'Kenza B.',
        roleId: 'coloriste',
        bio: 'La reine du blond polaire et de l\'ombré hair à Casablanca. 8 ans d\'expérience.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
    },
    {
        id: 'sarah',
        name: 'Sarah L.',
        roleId: 'lissage',
        bio: 'Maîtrise parfaite des lissages (Tanin, Brésilien, Collagène). Diagnostic personnalisé.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
    },
    {
        id: 'nadia',
        name: 'Nadia H.',
        roleId: 'estheticienne',
        bio: 'Experte en soins de la mariée et rituels du Hammam traditionnel.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
    },
    {
        id: 'leila',
        name: 'Leila M.',
        roleId: 'manucuriste',
        bio: 'Perfectionniste de la manucure russe et du Nail Art créatif.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80'
    },
];

export default function AdminTeam() {
    const { t } = useTranslation();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', roleId: '', bio: '', image: '' });

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'team'));
            setTeam(snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading team:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        if (!window.confirm("Voulez-vous initialiser l'équipe par défaut ?")) return;
        setLoading(true);
        try {
            for (const member of INITIAL_TEAM) {
                await addDoc(collection(db, 'team'), member);
            }
            await loadTeam();
            alert("Équipe initialisée avec succès !");
        } catch (error) {
            console.error("Error seeding team:", error);
            alert("Erreur lors de l'initialisation.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return;
        try {
            await deleteDoc(doc(db, 'team', id));
            setTeam(team.filter(t => t.firebaseId !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, 'team', editingId), formData);
            } else {
                await addDoc(collection(db, 'team'), formData);
            }
            setEditingId(null);
            setFormData({ name: '', roleId: '', bio: '', image: '' });
            loadTeam();
        } catch (error) {
            console.error("Error saving member:", error);
        }
    };

    const startEdit = (member) => {
        setEditingId(member.firebaseId);
        setFormData(member);
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Gestion de l'Équipe</h2>
                {team.length === 0 && (
                    <button onClick={handleSeed} className="btn btn-primary">
                        🚀 Initialiser l'Équipe
                    </button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>{editingId ? "Modifier" : "Ajouter"} un Membre</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input
                        type="text" placeholder="Nom complet" className="form-input"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <select
                            className="form-input"
                            value={formData.roleId}
                            onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                            required
                        >
                            <option value="">Rôle...</option>
                            <option value="coiffeuse">Coiffeuse</option>
                            <option value="coloriste">Coloriste Expert</option>
                            <option value="lissage">Spécialiste Lissage</option>
                            <option value="barbier">Barbier</option>
                            <option value="estheticienne">Esthéticienne</option>
                            <option value="manucuriste">Manucuriste</option>
                            <option value="masseuse">Masseuse</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <input
                        type="text" placeholder="URL Photo (Optionnel)" className="form-input"
                        value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <textarea
                        placeholder="Biographie / Expertise (ex: La reine du blond polaire...)"
                        className="form-input"
                        rows="3"
                        value={formData.bio || ''}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">{editingId ? "Mettre à jour" : "Ajouter"}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', roleId: '', bio: '', image: '' }) }} className="btn btn-outline">Annuler</button>}
                </div>
            </form>

            {/* List */}
            <div className="profile-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Membre</th>
                            <th style={{ padding: '1rem' }}>Rôle</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map(member => (
                            <tr key={member.firebaseId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: member.image ? `url(${member.image}) center/cover` : '#333',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem'
                                        }}>
                                            {!member.image && "👤"}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{member.bio?.substring(0, 50)}{member.bio?.length > 50 ? '...' : ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '20px',
                                        background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {member.roleId}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => startEdit(member)} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => handleDelete(member.firebaseId)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
