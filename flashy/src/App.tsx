import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyCbY5vHuH23apAuWR9Qf9MR6JQSmRvtLKI",
  authDomain: "tdt4140-2024-dev.firebaseapp.com",
  projectId: "tdt4140-2024-dev",
  storageBucket: "tdt4140-2024-dev.appspot.com",
  messagingSenderId: "218367360984",
  appId: "1:218367360984:web:17f6ca0e4b44b1b54dbcad",
  measurementId: "G-DW83FFH8V0"
};




const App:React.FC = () => {
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);


      // Initialize Cloud Firestore and get a reference to the service
      const db = getFirestore(app);

      const docRef = doc(db, "user", "m7lqMlyzp1wrnu21hegZ");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserData(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          What is this: {userData && <p>Username: {userData.username}</p>}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
