import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Un email de réinitialisation a été envoyé.');
        } catch (err) {
            setError('Impossible d\'envoyer l\'email. Vérifiez votre adresse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-overlay"></div>
            <div className="auth-container">
                <div className="auth-card glass-effect">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">JL <span>Beauty</span></Link>
                        <h2 className="auth-title">Mot de passe oublié</h2>
                        <p className="auth-subtitle">Entrez votre email pour réinitialiser</p>
                    </div>

                    {error && <div className="auth-error-message">{error}</div>}
                    {message && <div className="auth-success-message" style={{ color: '#4caf50', background: 'rgba(76, 175, 80, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{message}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
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

                        <button type="submit" className="btn btn-primary btn-block btn-glow" disabled={loading}>
                            {loading ? <span className="loader"></span> : 'Envoyer le lien'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <Link to="/connexion" className="auth-link">Retour à la connexion</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
