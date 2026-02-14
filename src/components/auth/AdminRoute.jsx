import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminRoute({ children }) {
    const { currentUser, loading: authLoading } = useAuth();
    const { isAdmin, loading: adminLoading } = useAdmin();

    if (authLoading || adminLoading) {
        return <div className="loading-screen">Chargement...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/connexion" />;
    }

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
}
