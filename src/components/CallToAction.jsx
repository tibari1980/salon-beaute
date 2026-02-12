import { Link } from 'react-router-dom';

export default function CallToAction() {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content">
                    <h2 className="cta-title">
                        Prêt(e) à <span>Sublimer</span> Votre Beauté ?
                    </h2>
                    <p className="cta-text">
                        Réservez votre prochain rendez-vous en quelques clics et offrez-vous une expérience beauté inoubliable avec nos experts.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/reservation" className="btn btn-primary btn-lg">
                            Réserver maintenant →
                        </Link>
                        <a href="tel:+33123456789" className="btn btn-outline btn-lg">
                            📞 Nous appeler
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
