import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDRjtWFwK-EzBd_MqhQkhuzUVPHUK3yDSs",
    authDomain: "prepsmart-60b88.firebaseapp.com",
    projectId: "prepsmart-60b88",
    storageBucket: "prepsmart-60b88.firebasestorage.app",
    messagingSenderId: "1016400716623",
    appId: "1:1016400716623:web:14ac5208aa6941368f9b3a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };