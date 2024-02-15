import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseClient, { auth } from "../lib/firebase/firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function InlogPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(firebaseClient);
  const navigateTo = useNavigate();

  async function signIn(email: string, password: string) {
    console.log("Trykk ble registrert");
    if (password.length < 6) {
      alert("Passord må være minst 6 tegn");
    } else {
      try {
        console.log("Prøver å logge inn");
        const loginInfo = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Success. Signed in ", loginInfo.user.email);
        navigateTo("/cards");
      } catch (e) {
        console.log("Prøver å registrere istedet");
        try {
          const loginInfo = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("Success. Registered ", loginInfo.user.email);
          navigateTo("/cards");
        } catch (e2) {
          console.error("Error: ", e2);
          if (e2 instanceof Error) {
            alert("Feil passord, prøv på nytt");
          }
        }
      }
    }
  }

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    signIn(email, password);
  }

  return (
    <>
      <div id="BackPanel">
        <div id="PinkPanel">
          <div id="LigthPinkPanel">
            <div id="GreenPanel">
              <p id="LogInLogo">Flashy</p>
              <form id="InlogField" onSubmit={onSubmit}>
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
                  <button id="submitButton" type="submit" value="Register">
                    Logg Inn eller registrer
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
