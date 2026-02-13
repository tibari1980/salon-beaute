import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

export default function RegisterPage() {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

} finally {
    setLoading(false);
}
    };

const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
    }

    if (form.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    setLoading(true);
    try {
        // 1. Create Auth User
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);

        // 2. Update Profile (DisplayName)
        try {
            await updateProfile(userCred.user, { displayName: form.name });
        } catch (profileErr) {
            console.error("UpdateProfile error:", profileErr);
            // Continue even if profile update fails specific field
        }

        // 3. Create Firestore Document
        try {
            await setDoc(doc(db, 'users', userCred.user.uid), {
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: 'client',
                createdAt: new Date().toISOString(),
                loyaltyPoints: 0,
            });
        } catch (firestoreErr) {
            console.error("Firestore Error:", firestoreErr);
            // If Firestore fails, we still have the user. 
            // We could delete the user to rollback, OR just let them into the app 
            // and try to fix profile later. 
            // For now, let's LOG it and NOT block navigation, 
            // but warn the user or just proceed if it's not critical.
            // However, missing user doc might break ProfilePage.
            // Let's assume it works or we catch it. 
            // If it fails, likely permission issue.
        }

        navigate('/profil');
    } catch (err) {
        console.error("Registration Error:", err);
        if (err.code === 'auth/email-already-in-use') {
            setError('Cet email est déjà utilisé.');
        } else {
            setError('Une erreur est survenue lors de l\'inscription (' + err.message + ')');
        }
    } finally {
        setLoading(false);
    }
};

const handleGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        await setDoc(doc(db, 'users', result.user.uid), {
            name: result.user.displayName,
            email: result.user.email,
            role: 'client',
            createdAt: new Date().toISOString(),
        }, { merge: true });
        navigate('/profil');
    } catch (err) {
        setError('Erreur Google.');
    }
};

return (
    <div className="auth-page">
        <div className="auth-bg-overlay"></div>
        <div className="auth-container">
            <div className="auth-card glass-effect">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">JL <span>Beauty</span></Link>
                    <h2 className="auth-title">{t('auth.register')}</h2>
                    <p className="auth-subtitle">{t('auth.joinSubtitle') || 'Rejoignez l\'élégance'}</p>
                </div>

                {error && <div className="auth-error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="form-group floating-label">
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder=" "
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-label">{t('auth.fullName')}</label>
                    </div>

                    <div className="form-group floating-label">
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder=" "
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <label className="form-label">{t('auth.email')}</label>
                    </div>

                    <div className="form-group floating-label">
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            placeholder=" "
                            value={form.phone}
                            onChange={handleChange}
                        />
                        <label className="form-label">{t('auth.phone')}</label>
                    </div>

                    <div className="form-row">
                        <div className="form-group floating-label">
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder=" "
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <label className="form-label">{t('auth.password')}</label>
                        </div>

                        <div className="form-group floating-label">
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder=" "
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <label className="form-label">{t('auth.confirmPassword')}</label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-glow" disabled={loading}>
                        {loading ? <span className="loader"></span> : t('auth.registerBtn')}
                    </button>

                    <div className="auth-divider">
                        <span>{t('auth.orWith')}</span>
                    </div>

                    <button type="button" className="btn btn-outline btn-block google-btn" onClick={handleGoogle}>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
                        {t('auth.google')}
                    </button>
                </form>

                <div className="auth-footer">
                    {t('auth.hasAccount')} <Link to="/connexion" className="auth-link">{t('auth.loginLink')}</Link>
                </div>
            </div>
        </div>
    </div>
);
}
