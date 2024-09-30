import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD3G0O9UoFMCRrKlIXaFf5dKGDBaPv1FUw",
    authDomain: "prepsmart-d6b2f.firebaseapp.com",
    projectId: "prepsmart-d6b2f",
    storageBucket: "prepsmart-d6b2f.appspot.com",
    messagingSenderId: "501001569750",
    appId: "1:501001569750:web:8022dfa6fefe87e0a85077",
    measurementId: "G-VYQCSSNYMW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };