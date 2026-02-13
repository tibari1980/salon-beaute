import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
    const { t } = useTranslation();

    return (
        <section className="about section" id="about">
            <div className="container">
                <div className="about-grid">
                    <div className="about-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80"
                            alt="JL Beauty"
                            className="about-image"
                        />
                        <div className="about-image-accent" />
                        <div className="about-stats">
                            <div>
                                <div className="about-stat-number">12+</div>
                                <div className="about-stat-label">{t('about.stat1Label')}</div>
                            </div>
                            <div>
                                <div className="about-stat-number">5K+</div>
                                <div className="about-stat-label">{t('about.stat2Label')}</div>
                            </div>
                            <div>
                                <div className="about-stat-number">15</div>
                                <div className="about-stat-label">{t('about.stat3Label')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="about-content">
                        <span className="section-subtitle">{t('about.badge')}</span>
                        <h2 className="section-title">
                            {t('about.title')} <span>{t('about.titleHighlight')}</span> {t('about.titleEnd')}
                        </h2>
                        <p className="about-text">{t('about.text1')}</p>
                        <p className="about-text">{t('about.text2')}</p>

                        <div className="about-features">
                            <div className="about-feature">
                                <div className="about-feature-icon">✨</div>
                                <span>{t('about.feature1')}</span>
                            </div>
                            <div className="about-feature">
                                <div className="about-feature-icon">🎨</div>
                                <span>{t('about.feature2')}</span>
                            </div>
                            <div className="about-feature">
                                <div className="about-feature-icon">💎</div>
                                <span>{t('about.feature3')}</span>
                            </div>
                            <div className="about-feature">
                                <div className="about-feature-icon">🌿</div>
                                <span>{t('about.feature4')}</span>
                            </div>
                        </div>

                        <Link to="/reservation" className="btn btn-primary">
                            {t('about.cta')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
