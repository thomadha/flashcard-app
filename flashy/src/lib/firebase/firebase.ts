import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbY5vHuH23apAuWR9Qf9MR6JQSmRvtLKI",
    authDomain: "tdt4140-2024-dev.firebaseapp.com",
    projectId: "tdt4140-2024-dev",
    storageBucket: "tdt4140-2024-dev.appspot.com",
    messagingSenderId: "218367360984",
    appId: "1:218367360984:web:17f6ca0e4b44b1b54dbcad",
    measurementId: "G-DW83FFH8V0"
};  

export const firebaseClient = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseClient);
export const auth = getAuth(firebaseClient);

setPersistence(auth, browserLocalPersistence);

export default firebaseClient;