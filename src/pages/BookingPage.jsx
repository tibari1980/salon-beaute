import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';



const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function BookingPage() {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPro, setSelectedPro] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // Load services and team from Firestore
    useEffect(() => {
        const loadData = async () => {
            try {
                const [servicesSnapshot, teamSnapshot] = await Promise.all([
                    getDocs(collection(db, 'services')),
                    getDocs(collection(db, 'team'))
                ]);

                const fetchedServices = servicesSnapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));
                setServices(fetchedServices);

                const fetchedTeam = teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProfessionals(fetchedTeam);
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setServicesLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle pre-selection from Services page
    useEffect(() => {
        if (!servicesLoading && location.state?.serviceId && services.length > 0) {
            const service = services.find(s => s.id === location.state.serviceId);
            if (service) {
                setSelectedService(service);
                // setStep(2); // Optional: Auto-advance
            }
        }
    }, [location.state, services, servicesLoading]);

    const handleBooking = async () => {
        // Check authentication
        if (!auth.currentUser) {
            navigate('/connexion');
            return;
        }

        // Validate all fields
        if (!selectedService || !selectedPro || !selectedDate || !selectedTime) {
            setError(t('booking.errorIncomplete') || 'Veuillez compléter toutes les étapes.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Check for double booking
            const q = query(
                collection(db, 'appointments'),
                where('date', '==', selectedDate),
                where('time', '==', selectedTime),
                where('professionalId', '==', selectedPro.id)
            );
            const querySnapshot = await getDocs(q);

            // Check if any appointment is active (not cancelled)
            const isBooked = querySnapshot.docs.some(doc => {
                const data = doc.data();
                return data.status !== 'cancelled';
            });

            if (isBooked) {
                setError(t('booking.errorDoubleBooking'));
                setLoading(false);
                return;
            }

            // Generate a readable booking reference
            const ref = 'BC-' + Math.random().toString(36).substring(2, 8).toUpperCase();

            const docRef = await addDoc(collection(db, 'appointments'), {
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName || t('booking.client'),
                userEmail: auth.currentUser.email || '',
                service: t(`booking.services.${selectedService.id}`, { lng: 'fr' }) !== `booking.services.${selectedService.id}` ? t(`booking.services.${selectedService.id}`, { lng: 'fr' }) : selectedService.id,
                serviceId: selectedService.id,
                servicePrice: selectedService.price,
                serviceDuration: selectedService.duration,
                professional: selectedPro.name,
                professionalId: selectedPro.id,
                date: selectedDate,
                time: selectedTime,
                status: 'confirmed',
                currency: 'Dhs',
                ref: ref,
                createdAt: new Date().toISOString(),
            });

            setBookingRef(ref);
            setSuccess(true);
        } catch (err) {
            console.error('Booking error:', err);
            if (err.code === 'permission-denied') {
                setError(t('booking.errorPermission'));
            } else {
                setError(t('booking.errorGeneric'));
            }
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', options);
    };

    // ──────────────── SUCCESS SCREEN ────────────────
    if (success) {
        return (
            <>
                <Navbar />
                <div className={`booking-page ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
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
                            {t('booking.success')}
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
                                {t('booking.ref')} {bookingRef}
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
                            textAlign: i18n.language === 'ar' ? 'right' : 'left',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.service')}</span>
                                <span style={{ fontWeight: 600 }}>
                                    {selectedService?.icon} {t(`booking.services.${selectedService?.id}`) !== `booking.services.${selectedService?.id}` ? t(`booking.services.${selectedService?.id}`) : selectedService?.id}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.professional')}</span>
                                <span style={{ fontWeight: 600 }}>{selectedPro?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.date')}</span>
                                <span style={{ fontWeight: 600 }}>{formatDate(selectedDate)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.time')}</span>
                                <span style={{ fontWeight: 600 }}>{selectedTime}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{t('booking.total')}</span>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{selectedService?.price} Dhs</span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            {t('booking.reminder')}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-outline" onClick={() => navigate('/profil')}>
                                📋 {t('booking.dashboardLink')}
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                🏠 {t('booking.homeLink')}
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
            <SEO
                title="Réserver un Rendez-vous"
                description="Prenez rendez-vous en ligne chez JL Beauty. Choisissez votre soin, votre experte et votre créneau horaire en quelques clics."
                url="/reservation"
            />
            <Navbar />
            <div className={`booking-page ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="container">
                    <div className="section-header" style={{ paddingTop: '20px' }}>
                        <span className="section-subtitle">{t('booking.title')}</span>
                        <h2 className="section-title">
                            {t('cta.book')}
                        </h2>
                    </div>

                    {/* Steps indicator */}
                    <div className="booking-steps">
                        <div className={`booking-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <span className="booking-step-number">{step > 1 ? '✓' : '1'}</span>
                            <span>{t('booking.step1')}</span>
                        </div>
                        <div className="booking-step-line" />
                        <div className={`booking-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <span className="booking-step-number">{step > 2 ? '✓' : '2'}</span>
                            <span>{t('booking.step2')}</span>
                        </div>
                        <div className="booking-step-line" />
                        <div className={`booking-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                            <span className="booking-step-number">{step > 3 ? '✓' : '3'}</span>
                            <span>{t('booking.step3')}</span>
                        </div>
                        <div className="booking-step-line" />
                        <div className={`booking-step ${step >= 4 ? 'active' : ''}`}>
                            <span className="booking-step-number">4</span>
                            <span>{t('booking.step4')}</span>
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
                            </div>
                        )}

                        {/* Step 1: Service */}
                        {step === 1 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>{t('booking.selectService')}</h3>
                                <div className="booking-services-grid">
                                    {servicesLoading ? (
                                        <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--color-gray-500)' }}>Chargement des services...</div>
                                    ) : services.length === 0 ? (
                                        <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--color-gray-500)' }}>
                                            Aucun service disponible pour le moment.
                                        </div>
                                    ) : services.map((s) => (
                                        <div
                                            key={s.id}
                                            className={`booking-service-option ${selectedService?.id === s.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedService(s)}
                                        >
                                            <div className="booking-service-icon">{s.icon}</div>
                                            <div className="booking-service-name">
                                                {t(`booking.services.${s.id}`) !== `booking.services.${s.id}` ? t(`booking.services.${s.id}`) : s.id}
                                            </div>
                                            <div className="booking-service-price">{s.price} Dhs</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>{s.duration}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right', marginTop: '2rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        disabled={!selectedService}
                                        onClick={() => setStep(2)}
                                    >
                                        {t('booking.next')} {i18n.language === 'ar' ? '←' : '→'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 2: Professional */}
                        {step === 2 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>{t('booking.selectPro')}</h3>
                                <div className="booking-services-grid">
                                    {professionals.map((p) => (
                                        <div
                                            key={p.id}
                                            className={`booking-service-option ${selectedPro?.id === p.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedPro(p)}
                                        >
                                            <div className="booking-service-icon">👤</div>
                                            <div className="booking-service-name">{p.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>
                                                {t(`booking.roles.${p.roleId}`) !== `booking.roles.${p.roleId}` ? t(`booking.roles.${p.roleId}`) : p.roleId}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(1)}>{i18n.language === 'ar' ? '→' : '←'} {t('booking.previous')}</button>
                                    <button className="btn btn-primary" disabled={!selectedPro} onClick={() => setStep(3)}>
                                        {t('booking.next')} {i18n.language === 'ar' ? '←' : '→'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Date & Time */}
                        {step === 3 && (
                            <>
                                <div className="booking-calendar">
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-gray-300)' }}>{t('booking.selectDate')}</h3>
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
                                            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-gray-300)' }}>{t('booking.selectTime')}</h3>
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
                                    <button className="btn btn-outline" onClick={() => setStep(2)}>{i18n.language === 'ar' ? '→' : '←'} {t('booking.previous')}</button>
                                    <button
                                        className="btn btn-primary"
                                        disabled={!selectedDate || !selectedTime}
                                        onClick={() => setStep(4)}
                                    >
                                        {t('booking.next')} {i18n.language === 'ar' ? '←' : '→'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 4: Summary & Confirmation */}
                        {step === 4 && (
                            <>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-300)' }}>{t('booking.summary')}</h3>
                                <div className="booking-summary">
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.service')}</span>
                                        <span>{selectedService?.icon} {t(`booking.services.${selectedService?.id}`)}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.professional')}</span>
                                        <span>{selectedPro?.name}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.date')}</span>
                                        <span>{formatDate(selectedDate)}</span>
                                    </div>
                                    <div className="booking-summary-row">
                                        <span style={{ color: 'var(--color-gray-500)' }}>{t('booking.time')}</span>
                                        <span>{selectedTime}</span>
                                    </div>
                                    <div className="booking-summary-row" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                        <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{t('booking.total')}</span>
                                        <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{selectedService?.price} Dhs</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', alignItems: 'center' }}>
                                    <button className="btn btn-outline" onClick={() => setStep(3)}>{i18n.language === 'ar' ? '→' : '←'} {t('booking.previous')}</button>
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
                                                {t('booking.loadingStub')}
                                            </>
                                        ) : (
                                            `✓ ${t('booking.confirm')}`
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
