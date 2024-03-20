import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseClient, { auth, db } from "../lib/firebase/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

function InlogPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(firebaseClient);
  const navigateTo = useNavigate();

  async function signInUser(event: React.SyntheticEvent) {
    if (password.length < 6) {
      alert("Passord må være minst 6 tegn");
    } else {
      try{
        event.preventDefault();
        const loginInfo = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        navigateTo("/home");
      } catch (e){
        console.error("Error: ", e);
        alert("Feil brukernavn eller passord");
      }
    }
  }

  async function registerUser(event: React.SyntheticEvent) {
    if (password.length < 6) {
      alert("Passord må være minst 6 tegn");
    }else{
      try {
        event.preventDefault();
        const loginInfo = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        
        // Legger til i brukertabell
        if (loginInfo) {
          if (auth.currentUser){
            await setDoc(doc(db, "user", auth.currentUser.uid), {
              email: email,
              username: email.split('@')[0]
            });
          }
        }

        console.log("Success. Registered ", loginInfo.user.email);
        navigateTo("/home");
      } catch (e) {
        console.error("Error: ", e);
        alert("Det finnes allerede en bruker med denne mailen"); 
      }
    }
  }

  return (
    <>
      <div id="BackPanel">
        <div id="PinkPanel">
          <div id="LigthPinkPanel">
            <div id="GreenPanel">
              <p id="LogInLogo">Flashy</p>
              <form id="InlogField">
                <input
                  id="emailInput"
                  placeholder="E-post"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                  id="passwordinput"
                  placeholder="Passord"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                  <button id="LoggInnBtn" onClick={signInUser}>
                    Logg Inn
                  </button>
                  <button id="RegisterBtn" onClick={registerUser}>
                    Registrer
                  </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InlogPanel;
