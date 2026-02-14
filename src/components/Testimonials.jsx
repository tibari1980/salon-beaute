import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Testimonials() {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userReview, setUserReview] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, text: '', service: '' });
    const [submitting, setSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);

    useEffect(() => {
        loadReviews();
    }, [t, currentUser]);

    const loadReviews = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'reviews'));
            if (!snapshot.empty) {
                const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReviews(reviewsData);

                // Check if current user has a review
                if (currentUser) {
                    const myReview = reviewsData.find(r => r.userId === currentUser.uid);
                    setUserReview(myReview || null);
                }
            } else {
                // Fallback to translations if DB is empty
                setReviews(t('testimonials.items', { returnObjects: true }));
            }
        } catch (err) {
            console.error("Error loading reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = () => {
        if (!userReview) return;
        setNewReview({
            rating: userReview.rating,
            text: userReview.text,
            service: userReview.service
        });
        setEditingReviewId(userReview.id);
        setShowModal(true);
    };

    const handleDeleteReview = async () => {
        if (!userReview || !window.confirm("Supprimer votre avis ?")) return;
        try {
            await deleteDoc(doc(db, 'reviews', userReview.id));
            alert("Avis supprimé.");
            setUserReview(null);
            loadReviews(); // Refresh list
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setSubmitting(true);
        try {
            const reviewData = {
                name: currentUser.displayName || "Cliente",
                text: newReview.text,
                rating: Number(newReview.rating),
                service: newReview.service || "Service",
                image: currentUser.photoURL || "", // Empty string to trigger initials fallback
                userId: currentUser.uid,
                updatedAt: serverTimestamp(),
                active: true
            };

            if (editingReviewId) {
                // Update existing
                await updateDoc(doc(db, 'reviews', editingReviewId), reviewData);
                alert("Votre avis a été modifié ! ✨");
            } else {
                // Double check if user already has a review to prevent duplicates via race condition
                if (userReview) {
                    alert("Vous avez déjà publié un avis.");
                    return;
                }

                // Create new
                reviewData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'reviews'), reviewData);
                alert("Merci pour votre avis ! ⭐");
            }

            setShowModal(false);
            setEditingReviewId(null);
            setNewReview({ rating: 5, text: '', service: '' });
            loadReviews();
        } catch (error) {
            console.error("Error saving review:", error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || '?';
    };

    return (
        <section className="testimonials section" id="temoignages">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">{t('testimonials.badge')}</span>
                    <h2 className="section-title">
                        {t('testimonials.title')} <span>{t('testimonials.titleHighlight')}</span>
                    </h2>
                    <p className="section-description">{t('testimonials.subtitle')}</p>
                </div>

                {/* User Action Area */}
                {currentUser && (
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        {userReview ? (
                            <div style={{
                                background: 'rgba(212, 175, 55, 0.1)',
                                border: '1px solid var(--color-gold)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                maxWidth: '600px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.2rem' }}>Votre avis est publié</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Merci d'avoir partagé votre expérience !</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={openEditModal} className="btn btn-sm" style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>✏️ Modifier</button>
                                    <button onClick={handleDeleteReview} className="btn btn-sm" style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171', border: '1px solid #f87171', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>🗑️ Supprimer</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => { setEditingReviewId(null); setShowModal(true); }} className="btn btn-primary">
                                ✍️ Donner mon avis
                            </button>
                        )}
                    </div>
                )}

                <div className="testimonials-grid">
                    {reviews.map((item, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(item.rating || 5)].map((_, i) => (
                                    <span key={i} className="testimonial-star">★</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{item.text}"</p>
                            <div className="testimonial-author">
                                {item.image && !item.image.includes('placeholder') ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="testimonial-author-image"
                                        loading="lazy"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}

                                {/* Fallback Initials */}
                                <div style={{
                                    display: (item.image && !item.image.includes('placeholder')) ? 'none' : 'flex',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: '#222',
                                    border: '1px solid var(--color-gold)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: 'var(--color-gold)',
                                    marginRight: '1rem',
                                    fontSize: '1.1rem'
                                }}>
                                    {getInitials(item.name)}
                                </div>

                                <div>
                                    <div className="testimonial-author-name">{item.name}</div>
                                    <div className="testimonial-author-service">{item.service}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Review Modal */}
                {showModal && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div className="modal-content" style={{
                            background: '#1a1a1a', padding: '2rem', borderRadius: '12px',
                            maxWidth: '500px', width: '90%', position: 'relative', border: '1px solid var(--color-gold)'
                        }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                            <h3 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                {editingReviewId ? "Modifier votre avis" : "Votre expérience"}
                            </h3>

                            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Service</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: Soin Visage"
                                        value={newReview.service}
                                        onChange={e => setNewReview({ ...newReview, service: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Note</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                style={{
                                                    background: 'none', border: 'none', fontSize: '1.5rem',
                                                    cursor: 'pointer',
                                                    color: star <= newReview.rating ? '#ffd700' : '#444'
                                                }}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Commentaire</label>
                                    <textarea
                                        className="form-input"
                                        rows="4"
                                        placeholder="Racontez-nous votre moment..."
                                        value={newReview.text}
                                        onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Envoi...' : (editingReviewId ? 'Mettre à jour' : 'Publier mon avis')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
