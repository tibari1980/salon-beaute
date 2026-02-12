const testimonials = [
    {
        name: 'Marie Dupont',
        service: 'Coupe & Brushing',
        text: 'Une expérience incroyable ! Sophie a parfaitement compris ce que je voulais. Le résultat est magnifique, je me sens transformée. Je recommande à 100% !',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    },
    {
        name: 'Jean-Pierre Moreau',
        service: 'Barbe & Coupe',
        text: 'Marc est un vrai artiste. Ma barbe n\'a jamais été aussi bien taillée. L\'ambiance du salon est top, on se sent tout de suite à l\'aise.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    },
    {
        name: 'Fatima El Mansouri',
        service: 'Soin Visage Premium',
        text: 'Le soin éclat premium est un pur bonheur. Ma peau est rayonnante et douce comme jamais. Amira est très professionnelle et attentive.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials section" id="temoignages">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Témoignages</span>
                    <h2 className="section-title">
                        Ce Que Disent Nos <span>Clients</span>
                    </h2>
                    <p className="section-description">
                        La satisfaction de nos clients est notre plus belle récompense. Découvrez leurs avis.
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((item, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(item.rating)].map((_, i) => (
                                    <span key={i} className="testimonial-star">★</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{item.text}"</p>
                            <div className="testimonial-author">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="testimonial-author-image"
                                    loading="lazy"
                                />
                                <div>
                                    <div className="testimonial-author-name">{item.name}</div>
                                    <div className="testimonial-author-service">{item.service}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
