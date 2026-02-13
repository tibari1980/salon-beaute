import { useTranslation } from 'react-i18next';

const memberImages = [
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
];

export default function Team() {
    const { t } = useTranslation();
    const members = t('team.members', { returnObjects: true });

    return (
        <section className="team section" id="equipe">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">{t('team.badge')}</span>
                    <h2 className="section-title">
                        {t('team.title')} <span>{t('team.titleHighlight')}</span> {t('team.titleEnd')}
                    </h2>
                    <p className="section-description">{t('team.subtitle')}</p>
                </div>

                <div className="team-grid">
                    {members.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-card-image-wrapper">
                                <img
                                    src={memberImages[index]}
                                    alt={member.name}
                                    className="team-card-image"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="team-card-name">{member.name}</h3>
                            <span className="team-card-role">{member.role}</span>
                            <p className="team-card-bio">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
