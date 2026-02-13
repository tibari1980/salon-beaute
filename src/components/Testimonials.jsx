import { useTranslation } from 'react-i18next';

const testimonialImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
];

export default function Testimonials() {
    const { t } = useTranslation();
    const items = t('testimonials.items', { returnObjects: true });

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
                    {items.map((item, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="testimonial-star">★</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{item.text}"</p>
                            <div className="testimonial-author">
                                <img
                                    src={testimonialImages[index]}
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
