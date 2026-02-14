import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';

// Hardcoded data for seeding
const INITIAL_SERVICES = [
    { id: 'coupe', price: 250, duration: '45 min', icon: '✂️', category: 'Coiffure' },
    { id: 'lissage', price: 1200, duration: '3h', icon: '🧬', category: 'Coiffure' },
    { id: 'coloration', price: 600, duration: '2h30', icon: '🎨', category: 'Coiffure' },
    { id: 'hammam', price: 350, duration: '1h15', icon: '🧖‍♀️', category: 'Soins' },
    { id: 'manucure', price: 250, duration: '1h', icon: '💅', category: 'Onglerie' },
    { id: 'maquillage', price: 500, duration: '1h', icon: '💄', category: 'Beauté' },
    { id: 'soin', price: 350, duration: '60 min', icon: '✨', category: 'Soins' },
    { id: 'pedicure', price: 200, duration: '55 min', icon: '🦶', category: 'Onglerie' },
];

export default function AdminServices() {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ id: '', price: '', duration: '', icon: '', category: '' });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'services'));
            setServices(snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        if (!window.confirm("Voulez-vous initialiser la base de données avec les services par défaut ?")) return;
        setLoading(true);
        try {
            for (const service of INITIAL_SERVICES) {
                await addDoc(collection(db, 'services'), service);
            }
            await loadServices();
            alert("Services initialisés avec succès !");
        } catch (error) {
            console.error("Error seeding services:", error);
            alert("Erreur lors de l'initialisation.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
        try {
            await deleteDoc(doc(db, 'services', id));
            setServices(services.filter(s => s.firebaseId !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, 'services', editingId), formData);
            } else {
                await addDoc(collection(db, 'services'), formData);
            }
            setEditingId(null);
            setFormData({ id: '', price: '', duration: '', icon: '', category: '' });
            loadServices();
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    const startEdit = (service) => {
        setEditingId(service.firebaseId);
        setFormData(service);
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Gestion des Services</h2>
                {services.length === 0 && (
                    <button onClick={handleSeed} className="btn btn-primary">
                        🚀 Initialiser les Données
                    </button>
                )}
            </div>

            {/* Simple Form */}
            <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>{editingId ? "Modifier" : "Ajouter"} un Service</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <input
                        type="text" placeholder="ID (ex: coupe)" className="form-input"
                        value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
                        required
                    />
                    <input
                        type="number" placeholder="Prix (Dhs)" className="form-input"
                        value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                    />
                    <input
                        type="text" placeholder="Durée (ex: 45 min)" className="form-input"
                        value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                        required
                    />
                    <input
                        type="text" placeholder="URL Image (Optionnel)" className="form-input"
                        value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Icône (Emoji)" className="form-input"
                        value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    />
                    <input
                        type="text" placeholder="Catégorie" className="form-input"
                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">{editingId ? "Mettre à jour" : "Ajouter"}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ id: '', price: '', duration: '', icon: '', category: '' }) }} className="btn btn-outline">Annuler</button>}
                </div>
            </form>

            {/* List */}
            <div className="profile-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Service</th>
                            <th style={{ padding: '1rem' }}>Catégorie</th>
                            <th style={{ padding: '1rem' }}>Prix</th>
                            <th style={{ padding: '1rem' }}>Durée</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.firebaseId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {service.image ? (
                                            <img src={service.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        ) : (
                                            <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>
                                                {t(`booking.services.${service.id}`) !== `booking.services.${service.id}` ? t(`booking.services.${service.id}`) : service.id}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>ID: {service.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{service.category}</td>
                                <td style={{ padding: '1rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>{service.price} Dhs</td>
                                <td style={{ padding: '1rem' }}>{service.duration}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => startEdit(service)} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => handleDelete(service.firebaseId)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
