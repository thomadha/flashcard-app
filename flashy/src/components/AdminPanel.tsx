import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { getAuth } from "firebase/auth";

function AdminPanel(){
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const adminRef = doc(db, "Administratorer", "UsersWithAdmin");

    useEffect(() => {
        const checkAdminStatus = async () => {
            const isAdminResult = await CheckIfAdmin();
            setIsAdmin(isAdminResult);
        };
        checkAdminStatus();
    }, []);

    async function CheckIfAdmin(){
        const auth = getAuth();
        const user = auth.currentUser;
        if(user != null){
            const mail = user.email;
            const arrayRef = doc(db, "Administratorer", "UsersWithAdmin");
            const AdminArrayDoc = await getDoc(arrayRef); 
            const AdminArray = AdminArrayDoc.get("AdminArray"); 
            return AdminArray.includes(mail);
        } else{
            return false; 
        }
    }

    async function addUser(event: React.SyntheticEvent) {
        event.preventDefault();
        await updateDoc(adminRef, {AdminArray: arrayUnion(email)})
        console.log(CheckIfAdmin); 
    }

    async function removeUser(event: React.SyntheticEvent) {
        event.preventDefault();
        await updateDoc(adminRef,{AdminArray: arrayRemove(email)})
    }

    return(
        <div id="divUser">
            {isAdmin && (
                <form id="UsersWithAccess" >
                <p id="text">Skriv inn bruker du ønsker å gi/fjerne adminrettigheter</p>
                <input
                    id="emailInput"
                    placeholder="E-post"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br/><br/>
                <button id="addAdminBtn" onClick={addUser}>
                    Legg til
                </button>
                <button id="removeAdminBtn" onClick={removeUser}>
                    Fjern
                </button>
                </form>
            )}
            {!isAdmin && (
                <p id="text">Du har dessverre ikke adminrettigheter</p>
            )}
        </div>
    );

}

export default AdminPanel; 