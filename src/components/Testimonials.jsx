import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Testimonials() {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, text: '', service: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [t]);

    const loadReviews = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'reviews'));
            if (!snapshot.empty) {
                setReviews(snapshot.docs.map(doc => doc.data()));
            } else {
                // Fallback to translations if DB is empty
                setReviews(t('testimonials.items', { returnObjects: true }).map((item, index) => ({
                    ...item,
                    rating: 5,
                    image: [
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                    ][index]
                })));
            }
        } catch (err) {
            console.error("Error loading reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        setSubmitting(true);
        try {
            const reviewData = {
                name: currentUser.displayName || "Cliente", // Should come from profile
                text: newReview.text,
                rating: Number(newReview.rating),
                service: newReview.service || "Service",
                image: currentUser.photoURL || "https://via.placeholder.com/100",
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
                active: true // Auto-publish for now
            };

            await addDoc(collection(db, 'reviews'), reviewData);

            // Close and refresh
            setShowModal(false);
            setNewReview({ rating: 5, text: '', service: '' });
            alert("Merci pour votre avis ! ⭐");
            loadReviews();
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Erreur lors de l'envoi de l'avis.");
        } finally {
            setSubmitting(false);
        }
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

                {currentUser && (
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary">
                            ✍️ Donner mon avis
                        </button>
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
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="testimonial-author-image"
                                    loading="lazy"
                                />
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
                            <h3 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', textAlign: 'center' }}>Votre expérience</h3>

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
                                    {submitting ? 'Envoi...' : 'Publier mon avis'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
