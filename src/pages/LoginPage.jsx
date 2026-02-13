import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function LoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/profil');
        } catch (err) {
            setError(t('auth.error') || 'Email ou mot de passe incorrect.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
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
                        <h2 className="auth-title">{t('auth.login')}</h2>
                        <p className="auth-subtitle">{t('auth.subtitle') || 'Accédez à votre espace beauté'}</p>
                    </div>

                    {error && <div className="auth-error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group floating-label">
                            <input
                                type="email"
                                className="form-input"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="form-label">{t('auth.email')}</label>
                        </div>

                        <div className="form-group floating-label">
                            <input
                                type="password"
                                className="form-input"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="form-label">{t('auth.password')}</label>
                        </div>

                        <div className="form-actions">
                            <Link to="/mot-de-passe-oublie" className="auth-forgot-link">Mot de passe oublié ?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-glow" disabled={loading}>
                            {loading ? <span className="loader"></span> : t('auth.loginBtn')}
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
                        {t('auth.noAccount')} <Link to="/inscription" className="auth-link">{t('auth.signupLink')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
