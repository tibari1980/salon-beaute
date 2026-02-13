import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <div className="page-wrapper">
            <Navbar />
            <main className="not-found-page" style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'var(--space-3xl) var(--space-xl)',
                background: 'var(--color-black)'
            }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <h1 style={{
                        fontSize: 'clamp(6rem, 15vw, 10rem)',
                        color: 'var(--color-gold)',
                        fontFamily: 'var(--font-display)',
                        lineHeight: 1,
                        marginBottom: 'var(--space-lg)'
                    }}>
                        404
                    </h1>
                    <h2 style={{
                        fontSize: '2rem',
                        color: 'var(--color-white)',
                        marginBottom: 'var(--space-md)',
                        fontFamily: 'var(--font-display)'
                    }}>
                        {t('notFound.title')}
                    </h2>
                    <p style={{
                        color: 'var(--color-gray-400)',
                        fontSize: '1.1rem',
                        marginBottom: 'var(--space-2xl)',
                        lineHeight: 1.6
                    }}>
                        {t('notFound.text')}
                    </p>
                    <Link to="/" className="btn btn-primary">
                        {t('notFound.button')}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
