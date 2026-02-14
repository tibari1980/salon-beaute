import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // List of allowed admin emails
    // In a real app, this should be a role in the user's Firestore document
    // For this MVP, we'll allow specific emails or valid users if we want to test easily
    const ADMIN_EMAILS = [
        'admin@jlbeauty.ma',
        'zerou@example.com', // Add the user's email here if known, otherwise they can register as admin
        // For testing purposes, let's allow any authenticated user initially
        // TODO: Enforce strict email check after testing
    ];

    if (loading) {
        return <div className="loading-screen">Chargement...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/connexion" />;
    }

    // Strict check (Uncomment to enforce)
    // if (!ADMIN_EMAILS.includes(currentUser.email)) {
    //     return <Navigate to="/" />;
    // }

    return children;
}
