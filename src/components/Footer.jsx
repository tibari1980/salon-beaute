import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer" id="contact">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <div className="footer-brand-name">Beauty<span>Connect</span></div>
                            <p className="footer-brand-desc">
                                Votre destination beauté par excellence. Nous sublimeons votre beauté naturelle avec passion et expertise depuis plus de 12 ans.
                            </p>
                            <div className="footer-socials">
                                <a href="#" className="footer-social-link" aria-label="Facebook">f</a>
                                <a href="#" className="footer-social-link" aria-label="Instagram">📷</a>
                                <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
                                <a href="#" className="footer-social-link" aria-label="TikTok">♪</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="footer-column-title">Navigation</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Accueil</Link></li>
                                <li><a href="#services">Services</a></li>
                                <li><a href="#equipe">Notre Équipe</a></li>
                                <li><Link to="/reservation">Réservation</Link></li>
                                <li><a href="#temoignages">Avis Clients</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-column-title">Services</h4>
                            <ul className="footer-links">
                                <li><a href="#services">Coiffure</a></li>
                                <li><a href="#services">Coloration</a></li>
                                <li><a href="#services">Soins Visage</a></li>
                                <li><a href="#services">Manucure</a></li>
                                <li><a href="#services">Maquillage</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-column-title">Contact</h4>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">📍</span>
                                <span>12 Rue de la Beauté<br />75008 Paris, France</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">📞</span>
                                <span>+33 1 23 45 67 89</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">✉️</span>
                                <span>contact@beautyconnect.fr</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">🕐</span>
                                <span>Lun - Sam : 9h - 19h<br />Dimanche : Fermé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>© 2026 Beauty<span>Connect</span>. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
