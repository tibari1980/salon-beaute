import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer" id="contact">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <div className="footer-brand-name">JL <span>Beauty</span></div>
                            <p className="footer-brand-desc">{t('footer.brandDesc')}</p>
                            <div className="footer-socials">
                                <a href="#" className="footer-social-link" aria-label="Facebook">f</a>
                                <a href="#" className="footer-social-link" aria-label="Instagram">📷</a>
                                <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
                                <a href="#" className="footer-social-link" aria-label="TikTok">♪</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="footer-column-title">{t('footer.navigation')}</h4>
                            <ul className="footer-links">
                                <li><Link to="/">{t('footer.home')}</Link></li>
                                <li><a href="#services">{t('footer.services')}</a></li>
                                <li><a href="#equipe">{t('footer.team')}</a></li>
                                <li><Link to="/reservation">{t('footer.booking')}</Link></li>
                                <li><a href="#temoignages">{t('footer.reviews')}</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-column-title">{t('footer.servicesTitle')}</h4>
                            <ul className="footer-links">
                                <li><a href="#services">{t('footer.hairdressing')}</a></li>
                                <li><a href="#services">{t('footer.coloring')}</a></li>
                                <li><a href="#services">{t('footer.facialCare')}</a></li>
                                <li><a href="#services">{t('footer.manicure')}</a></li>
                                <li><a href="#services">{t('footer.makeup')}</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-column-title">{t('footer.contactTitle')}</h4>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">📍</span>
                                <span>{t('footer.address')}<br />{t('footer.city')}</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">📞</span>
                                <span>{t('footer.phone')}</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">✉️</span>
                                <span>{t('footer.email')}</span>
                            </div>
                            <div className="footer-contact-item">
                                <span className="footer-contact-icon">🕐</span>
                                <span>{t('footer.hours')}<br />{t('footer.closed')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>© 2026 JL <span>Beauty</span>. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
}
