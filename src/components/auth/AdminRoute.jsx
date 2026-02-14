import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // List of allowed admin emails
    // In a real app, this should be a role in the user's Firestore document
    // For this MVP, we'll allow specific emails or valid users if we want to test easily
    const ADMIN_EMAILS = [
        'admin@jlbeauty.ma',
        'zerou@example.com',
        'tibarinewdzign@gmail.com'
    ];

    if (loading) {
        return <div className="loading-screen">Chargement...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/connexion" />;
    }

    // Strict check
    const normalizedUserEmail = currentUser.email?.toLowerCase().trim();
    const normalizedAdminEmails = ADMIN_EMAILS.map(e => e.toLowerCase());

    if (!normalizedAdminEmails.includes(normalizedUserEmail)) {
        return <Navigate to="/" />;
    }

    return children;
}
