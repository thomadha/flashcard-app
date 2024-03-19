import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useUserData } from "./FetchFirestoreData";
import { Link, useNavigate } from "react-router-dom";


function UserPanel(){
    const { userData, fetchUserData } = useUserData();
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [userId, setUserId] = useState<string>("");

    const [newUsername, setNewUsername] = useState("");
    const [dummy, setDummy] = useState(0)
    const [showModal, setShowModal] = useState(false);

    const navigateTo = useNavigate();

    const goToLogin = () => {
        navigateTo("/");
      };
    
    useEffect( () => {
        async function foo(){
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                setUserId(user?.uid);
                await fetchUserData(user?.uid);
            }
        }
        foo();
    }, [dummy, ]);

    useEffect(() => {
        if (userData) {
            console.log(userData);
            setEmail(userData.email); // Dette er veldig dårlig kode lol
            setUsername(userData.username);
        }
        
    }, [userData]);

    const handleEndreBrukernavn = async () => {
        try {
            if (username && newUsername !== ""){
                const docRef = doc(db, "user", userId);

                await updateDoc(docRef, {
                    username: newUsername
                }).then(() => setDummy(dummy + 1));

                setShowModal(false);
            }
        } catch (error) {
            return
        }
    }

    const handleTextChange = async (newText:string) => {
        setNewUsername(newText);
    }

    const handleShowModal = async () => {
        setShowModal(true)
    }

    const handleLogOut = async () => {
        const auth = getAuth();
        signOut(auth).then(() => {
        // Sign-out successful.
            console.log("Sign out successful");
            goToLogin()

        }).catch((error) => {
        // An error happened.
            console.log("an error happened")
        });
    }

 

    

    return(
        <div id="divUser">
            <p>Velkommen {username} </p>
            
        
            {showModal && (
                <div>
                    <textarea
                        value={newUsername}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder={"Skriv noe..."}
                    />
                    <button onClick={() => handleEndreBrukernavn()}> Bekreft</button>
                </div>
            )}

            <button onClick={() => handleShowModal()}>Endre brukernavn</button>
            <button onClick={() => handleLogOut()}>Logg ut</button>
            
            
        </div>
    );

}

export default UserPanel; 