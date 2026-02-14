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
                }
            } catch (err) {
                console.error("Error loading team:", err);
            } finally {
                setLoading(false);
            }
        };
        loadTeam();
    }, []);

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2) || '?';
    };

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
                    gap: '4rem',
                    justifyContent: 'center'
                }}>
                    {team.map((member, index) => (
                        <div key={index} className="team-card" style={{ textAlign: 'center', group: 'hover' }}>
                            <div
                                className="team-image-container"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--color-gold)',
                                    padding: '5px',
                                    margin: '0 auto 1.5rem',
                                    position: 'relative',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer',
                                    overflow: 'hidden' // Important for scaling
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3)';
                                    e.currentTarget.style.borderColor = '#fff';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                                }}
                            >
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            filter: 'grayscale(100%)',
                                            transition: 'filter 0.4s ease'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'grayscale(0%)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'grayscale(100%)'}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            // Show fallback div (next sibling)
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}

                                {/* Fallback Initials (Hidden by default if image exists, shown via onError or logic) */}
                                <div style={{
                                    display: member.image ? 'none' : 'flex',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #111, #222)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    color: 'var(--color-gold)',
                                    fontFamily: 'Playfair Display, serif',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {getInitials(member.name)}
                                </div>
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
                                display: 'inline-block',
                                fontSize: '0.8rem',
                                color: '#000',
                                background: 'var(--color-gold)',
                                padding: '5px 15px',
                                borderRadius: '20px',
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
                                margin: '0 auto',
                                fontStyle: 'italic'
                            }}>
                                {member.bio || "Experte Beauté passionnée."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
