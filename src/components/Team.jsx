const team = [
    {
        name: 'Sophie Laurent',
        role: 'Coiffeuse Styliste',
        bio: '12 ans d\'expérience en coiffure. Spécialiste des coupes modernes et colorations créatives.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    },
    {
        name: 'Marc Dubois',
        role: 'Barbier Expert',
        bio: 'Passionné par l\'art du rasage et les coupes masculines. Formé dans les meilleures académies parisiennes.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
        name: 'Amira Benali',
        role: 'Esthéticienne',
        bio: 'Experte en soins du visage et maquillage professionnel. Certifiée en dermocosmétique.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    },
    {
        name: 'Clara Martin',
        role: 'Manucuriste',
        bio: 'Artiste des ongles, spécialiste nail art et soins des mains. Toujours à la pointe des tendances.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
];

export default function Team() {
    return (
        <section className="team section" id="equipe">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Notre équipe</span>
                    <h2 className="section-title">
                        Des <span>Experts</span> à Votre Service
                    </h2>
                    <p className="section-description">
                        Une équipe de professionnels passionnés, dédiés à sublimer votre beauté avec talent et bienveillance.
                    </p>
                </div>

                <div className="team-grid">
                    {team.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-card-image-wrapper">
                                <img
                                    src={member.image}
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
