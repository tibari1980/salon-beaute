import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { currentUser, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setMobileOpen(false);
        if (!isHome) return;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLogout = async () => {
        try {
            await logout();
            setProfileMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link to="/" className="navbar-logo">
                        JL <span>Beauty</span>
                    </Link>

                    <div className="navbar-links">
                        {isHome ? (
                            <>
                                <a href="#accueil" onClick={() => scrollToSection('accueil')}>{t('nav.home')}</a>
                                <a href="#services" onClick={() => scrollToSection('services')}>{t('nav.services')}</a>
                                <a href="#equipe" onClick={() => scrollToSection('equipe')}>{t('nav.team')}</a>
                                <a href="#temoignages" onClick={() => scrollToSection('temoignages')}>{t('nav.reviews')}</a>
                                <a href="#contact" onClick={() => scrollToSection('contact')}>{t('nav.contact')}</a>
                            </>
                        ) : (
                            <>
                                <Link to="/">{t('nav.home')}</Link>
                                <Link to="/#services">{t('nav.services')}</Link>
                                <Link to="/#equipe">{t('nav.team')}</Link>
                                <Link to="/#contact">{t('nav.contact')}</Link>
                            </>
                        )}

                        <div className="language-switcher">
                            <button
                                className={i18n.language === 'fr' ? 'active' : ''}
                                onClick={() => changeLanguage('fr')}
                            >FR</button>
                            <button
                                className={i18n.language === 'ar' ? 'active' : ''}
                                onClick={() => changeLanguage('ar')}
                            >AR</button>
                        </div>

                        {currentUser ? (
                            <div className="navbar-user">
                                <button
                                    className="navbar-user-btn"
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                >
                                    <span className="navbar-user-avatar">
                                        {currentUser.photoURL ? (
                                            <img src={currentUser.photoURL} alt="User" />
                                        ) : (
                                            currentUser.displayName?.charAt(0) || 'U'
                                        )}
                                    </span>
                                </button>
                                {profileMenuOpen && (
                                    <div className="navbar-user-dropdown">
                                        <Link to="/profil" onClick={() => setProfileMenuOpen(false)}>
                                            {t('profile.title')}
                                        </Link>
                                        <button onClick={handleLogout}>{t('profile.logout')}</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="navbar-auth-buttons">
                                <Link to="/connexion" className="navbar-login-link">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/inscription" className="btn btn-outline-gold navbar-register-btn">
                                    {t('nav.register')}
                                </Link>
                            </div>
                        )}

                        <Link to="/reservation" className="btn btn-teal navbar-cta">
                            {t('nav.book')}
                        </Link>
                    </div>

                    <button className="navbar-toggle" onClick={() => setMobileOpen(true)} aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
                <div className="mobile-menu-links">
                    <div className="language-switcher" style={{ marginBottom: '1rem' }}>
                        <button
                            className={i18n.language === 'fr' ? 'active' : ''}
                            onClick={() => changeLanguage('fr')}
                        >FR</button>
                        <button
                            className={i18n.language === 'ar' ? 'active' : ''}
                            onClick={() => changeLanguage('ar')}
                        >AR</button>
                    </div>

                    {currentUser && (
                        <div className="mobile-menu-user">
                            <span>{t('profile.welcome')} {currentUser.displayName}</span>
                        </div>
                    )}

                    {isHome ? (
                        <>
                            <a href="#accueil" onClick={() => scrollToSection('accueil')}>{t('nav.home')}</a>
                            <a href="#services" onClick={() => scrollToSection('services')}>{t('nav.services')}</a>
                            <a href="#equipe" onClick={() => scrollToSection('equipe')}>{t('nav.team')}</a>
                            <a href="#temoignages" onClick={() => scrollToSection('temoignages')}>{t('nav.reviews')}</a>
                            <a href="#contact" onClick={() => scrollToSection('contact')}>{t('nav.contact')}</a>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={() => setMobileOpen(false)}>{t('nav.home')}</Link>
                            <Link to="/#services" onClick={() => setMobileOpen(false)}>{t('nav.services')}</Link>
                            <Link to="/#equipe" onClick={() => setMobileOpen(false)}>{t('nav.team')}</Link>
                            <Link to="/#contact" onClick={() => setMobileOpen(false)}>{t('nav.contact')}</Link>
                        </>
                    )}

                    {currentUser ? (
                        <>
                            <Link to="/profil" className="btn btn-outline" onClick={() => setMobileOpen(false)}>
                                {t('profile.title')}
                            </Link>
                            <button className="btn btn-ghost" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                                {t('profile.logout')}
                            </button>
                        </>
                    ) : (
                        <Link to="/connexion" className="btn btn-outline" onClick={() => setMobileOpen(false)}>
                            {t('nav.login')}
                        </Link>
                    )}

                    <Link to="/reservation" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                        {t('nav.bookNow')}
                    </Link>
                </div>
            </div>
        </>
    );
}
