import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import About from '../components/About';
import Services from '../components/Services';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function LandingPage() {
    return (
        <>
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
