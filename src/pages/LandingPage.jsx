import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import About from '../components/About';
import Services from '../components/Services';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function LandingPage() {
    return (
        <>
            <SEO
                title="Salon de Beauté & Coiffure à Casablanca"
                description="Découvrez JL Beauty, votre destination luxe pour la coiffure, les soins du visage, le lissage et l'onglerie à Casablanca. Réservez votre moment de détente."
            />
            <Navbar />
            <HeroSlider />
            <About />
            <Services />
            <Team />
            <Testimonials />
            <CallToAction />
            <Footer />
        </>
    );
}
