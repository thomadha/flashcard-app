import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCWilfenTq7cy67mr1y6Six9dR1KlHGi7M",
    authDomain: "tdt4140-2024.firebaseapp.com",
    projectId: "tdt4140-2024",
    storageBucket: "tdt4140-2024.appspot.com",
    messagingSenderId: "55189380953",
    appId: "1:55189380953:web:768d6c6b3827dd123eb648",
    measurementId: "G-MFK951QCKC"
};  

export const firebaseClient = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseClient);
export const auth = getAuth(firebaseClient);

setPersistence(auth, browserLocalPersistence);

export default firebaseClient;