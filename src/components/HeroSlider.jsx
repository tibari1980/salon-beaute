import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const images = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1920&q=80',
];

export default function HeroSlider() {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const slides = t('hero.slides', { returnObjects: true });

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="hero" id="accueil">
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div key={index} className={`hero-slide ${index === current ? 'active' : ''}`}>
                        <div
                            className="hero-slide-bg"
                            style={{ backgroundImage: `url(${images[index]})` }}
                        />
                        <div className="hero-slide-overlay" />
                        <div className="hero-content">
                            <span className="hero-badge">{slide.badge}</span>
                            <h1 className="hero-title">
                                {slide.title} <span>{slide.highlight}</span> {slide.end}
                            </h1>
                            <p className="hero-description">{slide.desc}</p>
                            <div className="hero-buttons">
                                <Link to="/reservation" className="btn btn-primary btn-lg">
                                    {t('hero.cta')}
                                </Link>
                                <a href="#services" className="btn btn-outline btn-lg">
                                    {t('hero.discover')}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hero-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-indicator ${index === current ? 'active' : ''}`}
                        onClick={() => setCurrent(index)}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="hero-scroll-hint">
                <span>Scroll</span>
                <div className="hero-scroll-line" />
            </div>
        </section>
    );
}
