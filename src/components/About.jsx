import { Link } from 'react-router-dom';

export default function About() {
    return (
        <section className="about section" id="about">
            <div className="container">
                <div className="about-grid">
                    <div className="about-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80"
                            alt="Intérieur du salon JL Beauty"
                            className="about-image"
                        />
                        <div className="about-image-accent" />
                        <div className="about-stats">
                            <div>
                                <div className="about-stat-number">12+</div>
                                <div className="about-stat-label">Années d'expérience</div>
                            </div>
                            <div>
                                <div className="about-stat-number">5K+</div>
                                <div className="about-stat-label">Clients satisfaits</div>
                            </div>
                            <div>
                                <div className="about-stat-number">15</div>
                                <div className="about-stat-label">Experts beauté</div>
                            </div>
                        </div>
                    </div>

                    <div className="about-content">
                        <span className="section-subtitle">À propos</span>
                        <h2 className="section-title">
                            Votre Salon de <span>Beauté</span> d'Exception
                        </h2>
                        <p className="about-text">
                            Fondé avec la passion de sublimer chaque individu, JL Beauty est bien plus qu'un salon de beauté.
                            C'est un espace où l'élégance rencontre l'expertise, où chaque visite est une expérience unique
                            de bien-être et de transformation.
                        </p>
                        <p className="about-text">
                            Notre équipe de professionnels qualifiés utilise des produits haut de gamme et les dernières
                            techniques pour vous offrir des résultats exceptionnels, dans une ambiance chaleureuse et raffinée.
                        </p>

                        <div className="about-features">
                            <div className="about-feature">
                                <div className="about-feature-icon">✨</div>
                                <span>Produits premium</span>
                            </div>
                            <div className="about-feature">
                                <div className="about-feature-icon">🎨</div>
                                <span>Experts certifiés</span>
                            </div>
                            <div className="about-feature">
                                <div className="about-feature-icon">💎</div>
                                <span>Ambiance luxueuse</span>
                            </div>
                            <div className="about-feature">
                                <div className="about-feature-icon">🌿</div>
                                <span>Produits naturels</span>
                            </div>
                        </div>

                        <Link to="/reservation" className="btn btn-primary">
                            Découvrir nos services →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
