import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

// Initial data for seeding (from current hardcoded testimonials)
const INITIAL_REVIEWS = [
    {
        name: "Houda El Fassi",
        text: "Mes cheveux revivent ! Le lissage est juste incroyable, souples et brillants. Merci Sarah pour le conseil.",
        rating: 5,
        service: "Lissage Protéine",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    },
    {
        name: "Salma Benjelloun",
        text: "J'ai pris le pack mariée complet. Le Hammam était royal et mon maquillage a tenu toute la soirée. Une équipe au top !",
        rating: 5,
        service: "Pack Mariée",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
    },
    {
        name: "Yasmine Tazi",
        text: "Enfin un salon à Casa qui maîtrise le blond sans abîmer les cheveux. Je recommande à 1000%.",
        rating: 5,
        service: "Ombré Hair",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
    }
];

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', text: '', rating: 5, service: '', image: '' });

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'reviews'));
            setReviews(snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error loading reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        if (!window.confirm("Voulez-vous initialiser les avis par défaut ?")) return;
        setLoading(true);
        try {
            for (const review of INITIAL_REVIEWS) {
                await addDoc(collection(db, 'reviews'), review);
            }
            await loadReviews();
            alert("Avis initialisés avec succès !");
        } catch (error) {
            console.error("Error seeding reviews:", error);
            alert("Erreur lors de l'initialisation.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cet avis ?")) return;
        try {
            await deleteDoc(doc(db, 'reviews', id));
            setReviews(reviews.filter(r => r.firebaseId !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...formData,
                rating: Number(formData.rating)
            };

            if (editingId) {
                await updateDoc(doc(db, 'reviews', editingId), dataToSave);
            } else {
                await addDoc(collection(db, 'reviews'), dataToSave);
            }
            setEditingId(null);
            setFormData({ name: '', text: '', rating: 5, service: '', image: '' });
            loadReviews();
        } catch (error) {
            console.error("Error saving review:", error);
        }
    };

    const startEdit = (review) => {
        setEditingId(review.firebaseId);
        setFormData(review);
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Gestion des Avis</h2>
                {reviews.length === 0 && (
                    <button onClick={handleSeed} className="btn btn-primary">
                        🚀 Initialiser les Avis
                    </button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>{editingId ? "Modifier" : "Ajouter"} un Avis</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <input
                            type="text" placeholder="Nom de la cliente" className="form-input"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            type="text" placeholder="Service (ex: Lissage)" className="form-input"
                            value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label>Note:</label>
                            <select
                                className="form-input"
                                value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                style={{ width: 'auto' }}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="1">⭐ (1)</option>
                            </select>
                        </div>
                    </div>

                    <textarea
                        placeholder="Le commentaire..."
                        className="form-input"
                        rows="3"
                        value={formData.text}
                        onChange={e => setFormData({ ...formData, text: e.target.value })}
                        required
                    />

                    <input
                        type="text" placeholder="URL Photo (Optionnel)" className="form-input"
                        value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary">{editingId ? "Mettre à jour" : "Ajouter"}</button>
                        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', text: '', rating: 5, service: '', image: '' }) }} className="btn btn-outline">Annuler</button>}
                    </div>
                </div>
            </form>

            {/* List */}
            <div className="profile-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {reviews.map(review => (
                        <div key={review.firebaseId} style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img
                                        src={review.image || 'https://via.placeholder.com/50'}
                                        alt={review.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{review.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}>{review.service}</div>
                                    </div>
                                </div>
                                <div style={{ color: '#ffd700' }}>
                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </div>
                            </div>

                            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-gray-300)', margin: '0.5rem 0' }}>
                                "{review.text}"
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto' }}>
                                <button onClick={() => startEdit(review)} className="btn btn-sm" style={{ background: '#333' }}>✏️</button>
                                <button onClick={() => handleDelete(review.firebaseId)} className="btn btn-sm" style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171' }}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
