import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAJv5LkIw60gdUNvFLZ0yAhMLmXL8oJElI",
    authDomain: "salon-beaute-c1e22.firebaseapp.com",
    projectId: "salon-beaute-c1e22",
    storageBucket: "salon-beaute-c1e22.firebasestorage.app",
    messagingSenderId: "549348779445",
    appId: "1:549348779445:web:6f7715921179e3aebb65fc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
