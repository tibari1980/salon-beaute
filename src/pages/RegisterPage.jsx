import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await updateProfile(userCred.user, { displayName: form.name });

            await setDoc(doc(db, 'users', userCred.user.uid), {
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: 'client',
                createdAt: new Date().toISOString(),
                loyaltyPoints: 0,
            });

            navigate('/profil');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Cet email est déjà utilisé.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await setDoc(doc(db, 'users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                phone: '',
                role: 'client',
                createdAt: new Date().toISOString(),
                loyaltyPoints: 0,
            }, { merge: true });
            navigate('/profil');
        } catch (err) {
            setError('Erreur de connexion avec Google.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">Beauty<span>Connect</span></Link>
                        <p className="auth-subtitle">Créez votre compte gratuitement</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Nom complet</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="Votre nom"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="votre@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                placeholder="+33 6 12 34 56 78"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Minimum 6 caractères"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirmer votre mot de passe"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </button>

                        <div className="auth-divider">ou</div>

                        <button type="button" className="auth-google-btn" onClick={handleGoogle}>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
                            </svg>
                            Continuer avec Google
                        </button>
                    </form>

                    <div className="auth-footer">
                        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
