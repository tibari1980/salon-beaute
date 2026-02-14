import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Team() {
    const { t } = useTranslation();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'team'));
                if (!snapshot.empty) {
                    setTeam(snapshot.docs.map(doc => doc.data()));
                } else {
                    // Fallback to translations/hardcoded if DB is empty
                    // But preferably we want the user to seed from admin
                }
            } catch (err) {
                console.error("Error loading team:", err);
            } finally {
                setLoading(false);
            }
        };
        loadTeam();
    }, []);

    return (
        <section className="team section" id="equipe" style={{ backgroundColor: '#0a0a0a', padding: '6rem 0' }}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: '4rem' }}>
                    <span className="section-subtitle" style={{ color: 'var(--color-gold)', letterSpacing: '3px', fontSize: '0.9rem' }}>NOS ARTISTES</span>
                    <h2 className="section-title" style={{ marginTop: '0.5rem', fontSize: '2.5rem' }}>
                        L'Élite de la <span style={{ color: 'var(--color-gold)', fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>Beauté</span> au Maroc
                    </h2>
                    <p className="section-description" style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: '#888' }}>
                        Nos expertes sont régulièrement formées aux dernières tendances mondiales (Dubaï, Paris, Beyrouth).
                    </p>
                </div>

                <div className="team-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '3rem',
                    justifyContent: 'center'
                }}>
                    {team.map((member, index) => (
                        <div key={index} className="team-card" style={{ textAlign: 'center' }}>
                            <div className="team-card-image-wrapper" style={{
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                border: '2px solid var(--color-gold)',
                                padding: '5px',
                                margin: '0 auto 1.5rem',
                                transition: 'transform 0.3s ease'
                            }}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        filter: 'grayscale(20%) sepia(10%)'
                                    }}
                                    loading="lazy"
                                />
                            </div>

                            <h3 style={{
                                fontSize: '1.4rem',
                                marginBottom: '0.5rem',
                                color: '#fff',
                                fontFamily: 'Playfair Display, serif'
                            }}>
                                {member.name}
                            </h3>

                            <span style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                color: 'var(--color-gold)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '1rem',
                                fontWeight: 'bold'
                            }}>
                                {member.roleId.toUpperCase()}
                            </span>

                            <p style={{
                                fontSize: '0.95rem',
                                color: '#aaa',
                                lineHeight: '1.6',
                                maxWidth: '300px',
                                margin: '0 auto'
                            }}>
                                {member.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
