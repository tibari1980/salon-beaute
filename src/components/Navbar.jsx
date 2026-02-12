import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

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

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link to="/" className="navbar-logo">
                        Beauty<span>Connect</span>
                    </Link>

                    <div className="navbar-links">
                        {isHome ? (
                            <>
                                <a href="#accueil" onClick={() => scrollToSection('accueil')}>Accueil</a>
                                <a href="#services" onClick={() => scrollToSection('services')}>Services</a>
                                <a href="#equipe" onClick={() => scrollToSection('equipe')}>Équipe</a>
                                <a href="#temoignages" onClick={() => scrollToSection('temoignages')}>Avis</a>
                                <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
                            </>
                        ) : (
                            <>
                                <Link to="/">Accueil</Link>
                                <Link to="/#services">Services</Link>
                                <Link to="/#equipe">Équipe</Link>
                                <Link to="/#contact">Contact</Link>
                            </>
                        )}
                        <Link to="/reservation" className="btn btn-teal navbar-cta">
                            Réserver
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
                    {isHome ? (
                        <>
                            <a href="#accueil" onClick={() => scrollToSection('accueil')}>Accueil</a>
                            <a href="#services" onClick={() => scrollToSection('services')}>Services</a>
                            <a href="#equipe" onClick={() => scrollToSection('equipe')}>Équipe</a>
                            <a href="#temoignages" onClick={() => scrollToSection('temoignages')}>Avis</a>
                            <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={() => setMobileOpen(false)}>Accueil</Link>
                            <Link to="/#services" onClick={() => setMobileOpen(false)}>Services</Link>
                            <Link to="/#equipe" onClick={() => setMobileOpen(false)}>Équipe</Link>
                            <Link to="/#contact" onClick={() => setMobileOpen(false)}>Contact</Link>
                        </>
                    )}
                    <Link to="/reservation" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                        Réserver maintenant
                    </Link>
                    <Link to="/connexion" className="btn btn-outline" onClick={() => setMobileOpen(false)}>
                        Connexion
                    </Link>
                </div>
            </div>
        </>
    );
}
