import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function useAdmin() {
    const { currentUser } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!currentUser) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                // 1. Check strict list (fallback/super-admin)
                const SUPER_ADMINS = ['admin@jlbeauty.ma', 'zerou@example.com', 'tibarinewdzign@gmail.com'];
                const isSuperAdmin = SUPER_ADMINS.map(e => e.toLowerCase()).includes(currentUser.email?.toLowerCase().trim());

                if (isSuperAdmin) {
                    setIsAdmin(true);
                    setLoading(false);
                    return;
                }

                // 2. Check Firestore Role
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Admin check failed", err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [currentUser]);

    return { isAdmin, loading };
}
