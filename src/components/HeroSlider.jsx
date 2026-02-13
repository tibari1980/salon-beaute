import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
        badge: 'Bienvenue chez JL Beauty',
        title: <>Sublimez votre <span>Beauté</span> Naturelle</>,
        description: 'Découvrez un espace dédié à votre bien-être. Nos experts vous accompagnent pour révéler votre éclat naturel avec des soins personnalisés.',
    },
    {
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80',
        badge: 'Excellence & Savoir-faire',
        title: <>L'Art de la <span>Coiffure</span> d'Exception</>,
        description: 'Des coupes tendance aux colorations sur mesure, nos coiffeurs experts créent le style qui vous ressemble.',
    },
    {
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80',
        badge: 'Détente & Sérénité',
        title: <>Votre Moment de <span>Bien-être</span></>,
        description: 'Offrez-vous une parenthèse de détente avec nos soins du visage, manucures et pédicures réalisés par des professionnels passionnés.',
    },
    {
        image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1920&q=80',
        badge: 'Réservez en ligne',
        title: <>Réservez en <span>un Clic</span></>,
        description: 'Plus besoin d\'appeler ! Choisissez votre prestation, votre professionnel et votre créneau en quelques secondes.',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

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
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        <div className="hero-slide-overlay" />
                        <div className="hero-content">
                            <span className="hero-badge">{slide.badge}</span>
                            <h1 className="hero-title">{slide.title}</h1>
                            <p className="hero-description">{slide.description}</p>
                            <div className="hero-buttons">
                                <Link to="/reservation" className="btn btn-primary btn-lg">
                                    Réserver maintenant →
                                </Link>
                                <a href="#services" className="btn btn-outline btn-lg">
                                    Nos Services
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
