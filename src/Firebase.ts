import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA2kEGzbyfyW5HGZxO2-VR2ymqly_UQx0c",
    authDomain: "test-dfde4.firebaseapp.com",
    projectId: "test-dfde4",
    storageBucket: "test-dfde4.appspot.com",
    messagingSenderId: "1020205244105",
    appId: "1:1020205244105:web:749eab412f71ad2f2d3718",
    measurementId: "G-K6BYYJ7TFX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);