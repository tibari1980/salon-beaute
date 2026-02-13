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
    const [bookingRef, setBookingRef] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleBooking = async () => {
        // Check authentication
        if (!auth.currentUser) {
            navigate('/connexion');
            return;
        }

        // Validate all fields
        if (!selectedService || !selectedPro || !selectedDate || !selectedTime) {
            setError('Veuillez compléter toutes les étapes avant de confirmer.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const docRef = await addDoc(collection(db, 'appointments'), {
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName || 'Client',
                userEmail: auth.currentUser.email || '',
                service: selectedService.name,
                serviceId: selectedService.id,
                servicePrice: selectedService.price,
                serviceDuration: selectedService.duration,
                professional: selectedPro.name,
                professionalId: selectedPro.id,
                date: selectedDate,
                time: selectedTime,
                status: 'confirmed',
                currency: 'Dhs',
                createdAt: new Date().toISOString(),
            });

            // Generate a readable booking reference
            const ref = 'BC-' + docRef.id.slice(-6).toUpperCase();
            setBookingRef(ref);
            setSuccess(true);
        } catch (err) {
            console.error('Booking error:', err);
            if (err.code === 'permission-denied') {
                setError('Erreur de permission. Veuillez vous reconnecter.');
            } else {
                setError('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Format date for display (e.g., "28 Février 2026")
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    };

    // ──────────────── SUCCESS SCREEN ────────────────
    if (success) {
        return (
            <>
                <Navbar />
                <div className="booking-page">
                    <div className="container" style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
                        {/* Animated checkmark */}
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.1))',
                            border: '3px solid #4ade80',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                            fontSize: '3rem',
                            animation: 'fadeInScale 0.5s ease-out',
                        }}>
                            ✓
                        </div>

                        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                            Réservation <span>Confirmée</span> !
                        </h2>

                        {bookingRef && (
                            <div style={{
                                display: 'inline-block',
                                background: 'rgba(212, 175, 55, 0.1)',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '8px',
                                padding: '6px 16px',
                                marginBottom: '2rem',
                                color: 'var(--color-gold)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                letterSpacing: '1px',
                            }}>
                                Réf: {bookingRef}
                            </div>
                        )}

                        {/* Booking details card */}
                        <div style={{
                            maxWidth: '500px',
                            margin: '0 auto 2rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            textAlign: 'left',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>Service</span>
                                <span style={{ fontWeight: 600 }}>{selectedService?.icon} {selectedService?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>Professionnel</span>
                                <span style={{ fontWeight: 600 }}>{selectedPro?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>Date</span>
                                <span style={{ fontWeight: 600 }}>{formatDate(selectedDate)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>Heure</span>
                                <span style={{ fontWeight: 600 }}>{selectedTime}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>Durée</span>
                                <span style={{ fontWeight: 600 }}>{selectedService?.duration}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{selectedService?.price} Dhs</span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Un rappel vous sera envoyé avant votre rendez-vous. <br />
                            Vous pouvez consulter vos réservations dans votre tableau de bord.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-outline" onClick={() => navigate('/profil')}>
                                📋 Mes rendez-vous
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                🏠 Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // ──────────────── BOOKING FORM ────────────────
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
                        {/* Error message */}
                        {error && (
                            <div style={{
                                background: 'rgba(248, 113, 113, 0.1)',
                                border: '1px solid rgba(248, 113, 113, 0.3)',
                                borderRadius: '12px',
                                padding: '1rem 1.5rem',
                                marginBottom: '1.5rem',
                                color: '#f87171',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}>
                                <span>⚠️</span>
                                <span>{error}</span>
                                <button
                                    onClick={() => setError('')}
                                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem' }}
                                >✕</button>
                            </div>
                        )}

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

                        {/* Step 4: Summary & Confirmation */}
                        {step === 4 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>Récapitulatif de votre réservation :</h3>
                                <div className="booking-summary">
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Service</span>
                                        <span>{selectedService?.icon} {selectedService?.name}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Professionnel</span>
                                        <span>{selectedPro?.name}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Date</span>
                                        <span>{formatDate(selectedDate)}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Heure</span>
                                        <span>{selectedTime}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>Durée</span>
                                        <span>{selectedService?.duration}</span>
                                    </div>
                                    <div className="booking-summary-row" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                        <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                        <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{selectedService?.price} Dhs</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', alignItems: 'center' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(3)}>← Retour</button>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleBooking}
                                        disabled={loading}
                                        style={{
                                            minWidth: '260px',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="loader" style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    border: '2px solid rgba(0,0,0,0.2)',
                                                    borderTop: '2px solid #000',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.6s linear infinite',
                                                    display: 'inline-block',
                                                }}></span>
                                                Confirmation en cours...
                                            </>
                                        ) : (
                                            '✓ Confirmer la réservation'
                                        )}
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
