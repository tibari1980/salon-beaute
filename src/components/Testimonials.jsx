import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Testimonials() {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        loadReviews();
    }, [t]);

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
            </div>
        </section>
    );
}
