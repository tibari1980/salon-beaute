const services = [
    {
        category: 'Coiffure',
        title: 'Coupe & Brushing',
        description: 'Une coupe tendance adaptée à votre visage, suivie d\'un brushing professionnel pour un résultat impeccable.',
        price: '35€',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    },
    {
        category: 'Coloration',
        title: 'Coloration & Balayage',
        description: 'Des couleurs vibrantes et naturelles réalisées avec des produits de qualité professionnelle.',
        price: '65€',
        duration: '90 min',
        image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80',
    },
    {
        category: 'Soins Visage',
        title: 'Soin Éclat Premium',
        description: 'Un soin complet pour raviver l\'éclat de votre peau : nettoyage, gommage, masque et hydratation.',
        price: '55€',
        duration: '60 min',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    },
    {
        category: 'Manucure',
        title: 'Manucure Prestige',
        description: 'Soin des mains complet avec pose de vernis semi-permanent, pour des ongles sublimes.',
        price: '40€',
        duration: '50 min',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
    },
    {
        category: 'Maquillage',
        title: 'Maquillage Événement',
        description: 'Un maquillage professionnel adapté à votre événement : mariage, soirée, shooting photo.',
        price: '50€',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
    },
    {
        category: 'Pédicure',
        title: 'Pédicure Spa',
        description: 'Un moment de détente pour vos pieds avec bain, soin, gommage et pose de vernis.',
        price: '45€',
        duration: '55 min',
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80',
    },
];

export default function Services() {
    return (
        <section className="services section" id="services">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Ce que nous offrons</span>
                    <h2 className="section-title">
                        Nos <span>Services</span> d'Exception
                    </h2>
                    <p className="section-description">
                        Découvrez notre gamme complète de prestations beauté, réalisées par des professionnels passionnés avec des produits haut de gamme.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-card-image-wrapper">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="service-card-image"
                                    loading="lazy"
                                />
                                <span className="service-card-price">{service.price}</span>
                            </div>
                            <div className="service-card-body">
                                <span className="service-card-category">{service.category}</span>
                                <h3 className="service-card-title">{service.title}</h3>
                                <p className="service-card-desc">{service.description}</p>
                                <div className="service-card-footer">
                                    <span className="service-card-duration">🕐 {service.duration}</span>
                                    <a href="/reservation" className="service-card-link">
                                        Réserver →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
