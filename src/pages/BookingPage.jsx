import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serviceOptions = [
    { id: 'coupe', name: 'Coupe & Brushing', price: 200, duration: '45 min', icon: '✂️' },
    { id: 'coloration', name: 'Coloration & Balayage', price: 450, duration: '90 min', icon: '🎨' },
    { id: 'soin', name: 'Soin Éclat Premium', price: 350, duration: '60 min', icon: '✨' },
    { id: 'manucure', name: 'Manucure Prestige', price: 150, duration: '50 min', icon: '💅' },
    { id: 'maquillage', name: 'Maquillage Événement', price: 350, duration: '45 min', icon: '💄' },
    { id: 'pedicure', name: 'Pédicure Spa', price: 200, duration: '55 min', icon: '🦶' },
];

const professionals = [
    { id: 'sophie', name: 'Sophie Laurent', role: 'Coiffeuse' },
    { id: 'marc', name: 'Marc Dubois', role: 'Barbier' },
    { id: 'amira', name: 'Amira Benali', role: 'Esthéticienne' },
    { id: 'clara', name: 'Clara Martin', role: 'Manucuriste' },
];

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPro, setSelectedPro] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleBooking = async () => {
        if (!auth.currentUser) {
            navigate('/connexion');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'appointments'), {
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName || 'Client',
                service: selectedService.name,
                servicePrice: selectedService.price,
                professional: selectedPro.name,
                date: selectedDate,
                time: selectedTime,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
            });
            setSuccess(true);
        } catch (err) {
            console.error('Booking error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <Navbar />
                <div className="booking-page">
                    <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
                        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
                            Réservation <span>Confirmée</span> !
                        </h2>
                        <p className="section-description" style={{ marginBottom: '2rem' }}>
                            Votre rendez-vous pour <strong>{selectedService.name}</strong> avec <strong>{selectedPro.name}</strong> est confirmé
                            le <strong>{selectedDate}</strong> à <strong>{selectedTime}</strong>.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="booking-page">
                <div className="container">
                    <div className="section-header" style={{ paddingTop: '20px' }}>
                        <span className="section-subtitle">Réservation</span>
                        <h2 className="section-title">
                            Réservez Votre <span>Rendez-vous</span>
                        </h2>
                    </div>

                    {/* Steps indicator */}
                    <div className="booking-steps">
                        <div className={`booking-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <span className="booking-step-number">{step > 1 ? '✓' : '1'}</span>
                            <span>Service</span>
                        </div>
                        <div className="booking-step-line" />
                        <div className={`booking-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <span className="booking-step-number">{step > 2 ? '✓' : '2'}</span>
                            <span>Professionnel</span>
                        </div>
                        <div className="booking-step-line" />
                        <div className={`booking-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                            <span className="booking-step-number">{step > 3 ? '✓' : '3'}</span>
                            <span>Date & Heure</span>
                        </div>
                        <div className="booking-step-line" />
                        <div className={`booking-step ${step >= 4 ? 'active' : ''}`}>
                            <span className="booking-step-number">4</span>
                            <span>Confirmation</span>
                        </div>
                    </div>

                    <div className="booking-content">
                        {/* Step 1: Service */}
                        {step === 1 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>Choisissez une prestation :</h3>
                                <div className="booking-services-grid">
                                    {serviceOptions.map((s) => (
                                        <div
                                            key={s.id}
                                            className={`booking-service-option ${selectedService?.id === s.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedService(s)}
                                        >
                                            <div className="booking-service-icon">{s.icon}</div>
                                            <div className="booking-service-name">{s.name}</div>
                                            <div className="booking-service-price">{s.price} Dhs</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>{s.duration}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        disabled={!selectedService}
                                        onClick={() => setStep(2)}
                                    >
                                        Continuer →
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 2: Professional */}
                        {step === 2 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>Choisissez un professionnel :</h3>
                                <div className="booking-services-grid">
                                    {professionals.map((p) => (
                                        <div
                                            key={p.id}
                                            className={`booking-service-option ${selectedPro?.id === p.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedPro(p)}
                                        >
                                            <div className="booking-service-icon">👤</div>
                                            <div className="booking-service-name">{p.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>{p.role}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Retour</button>
                                    <button className="btn btn-primary" disabled={!selectedPro} onClick={() => setStep(3)}>
                                        Continuer →
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Date & Time */}
                        {step === 3 && (
                            <>
                                <div className="booking-calendar">
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-gray-300)' }}>Choisissez une date :</h3>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        style={{ maxWidth: '300px' }}
                                    />

                                    {selectedDate && (
                                        <>
                                            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-gray-300)' }}>Choisissez un créneau :</h3>
                                            <div className="booking-time-slots">
                                                {timeSlots.map((time) => (
                                                    <div
                                                        key={time}
                                                        className={`booking-time-slot ${selectedTime === time ? 'selected' : ''}`}
                                                        onClick={() => setSelectedTime(time)}
                                                    >
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(2)}>← Retour</button>
                                    <button
                                        className="btn btn-primary"
                                        disabled={!selectedDate || !selectedTime}
                                        onClick={() => setStep(4)}
                                    >
                                        Continuer →
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 4: Summary */}
                        {step === 4 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>Récapitulatif de votre réservation :</h3>
                                <div className="booking-summary">
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Service</span>
                                        <span>{selectedService?.name}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Professionnel</span>
                                        <span>{selectedPro?.name}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Date</span>
                                        <span>{selectedDate}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Heure</span>
                                        <span>{selectedTime}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Durée</span>
                                        <span>{selectedService?.duration}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span>Total</span>
                                        <span>{selectedService?.price} Dhs</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(3)}>← Retour</button>
                                    <button className="btn btn-primary btn-lg" onClick={handleBooking} disabled={loading}>
                                        {loading ? 'Réservation...' : '✓ Confirmer la réservation'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
