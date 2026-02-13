import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const images = [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80',
];

export default function Services() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const items = t('services.items', { returnObjects: true });

    const handleBooking = (serviceId) => {
        navigate('/reservation', { state: { serviceId } });
    };

    return (
        <section className="services section" id="services">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">{t('services.badge')}</span>
                    <h2 className="section-title">
                        {t('services.title')} <span>{t('services.titleHighlight')}</span> {t('services.titleEnd')}
                    </h2>
                    <p className="section-description">{t('services.subtitle')}</p>
                </div>

                <div className="services-grid">
                    {items.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-card-image-wrapper">
                                <img
                                    src={images[index]}
                                    alt={service.title}
                                    className="service-card-image"
                                    loading="lazy"
                                />
                                <span className="service-card-price">{service.price}</span>
                            </div>
                            <div className="service-card-body">
                                <span className="service-card-category">{service.category}</span>
                                <h3 className="service-card-title">{service.title}</h3>
                                <p className="service-card-desc">{service.description}</p>
                                <div className="service-card-footer">
                                    <span className="service-card-duration">🕐 {service.duration}</span>
                                    <a
                                        href="/reservation"
                                        className="service-card-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleBooking(service.id);
                                        }}
                                    >
                                        {t('services.bookLink')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
