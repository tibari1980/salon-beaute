import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CallToAction() {
    const { t } = useTranslation();

    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content">
                    <h2 className="cta-title">
                        {t('cta.title')} <span>{t('cta.titleHighlight')}</span> {t('cta.titleEnd')}
                    </h2>
                    <p className="cta-text">{t('cta.text')}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/reservation" className="btn btn-primary btn-lg">
                            {t('cta.book')}
                        </Link>
                        <a href="tel:+33123456789" className="btn btn-outline btn-lg">
                            {t('cta.call')}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
