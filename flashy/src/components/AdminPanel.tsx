import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { getAuth } from "firebase/auth";
import { useListAllUsers } from "./FetchFirestoreData";

function AdminPanel(){
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const adminRef = doc(db, "Administratorer", "UsersWithAdmin");
    const [AdminArray, setAdminArray] = useState<string[]>([]);
    
    const { usersList: allUsers, fetchAllUsers } = useListAllUsers();

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    async function CheckIfAdmin(){
        
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            if(user != null && user.email != null){
                const mail = user.email;
                const arrayRef = doc(db, "Administratorer", "UsersWithAdmin");
                const AdminArrayDoc = await getDoc(arrayRef); 
                setAdminArray(AdminArrayDoc.get("AdminArray"));
                return AdminArrayDoc.get("AdminArray").includes(mail);
            } else{
                return false; 
            }
        } catch (error) {
            return []
        }

    }

    
    useEffect(() => {
        const checkAdminStatus = async () => {
            const isAdminResult= await CheckIfAdmin();
            if(isAdminResult){
                setIsAdmin(true); 
            }
        };
        checkAdminStatus();
    }, []);



    async function addUser(event: React.SyntheticEvent) {
        event.preventDefault();
        await updateDoc(adminRef, {AdminArray: arrayUnion(email)})
        if(!AdminArray.includes(email)){
            setAdminArray([...AdminArray, email]);
        }
    }

    async function removeUser(event: React.SyntheticEvent) {
        event.preventDefault();
        await updateDoc(adminRef,{AdminArray: arrayRemove(email)})
        setAdminArray(AdminArray.filter(item => item !== email));
    }

    return(
        <div id="divUser">
            {isAdmin && (
                <div>
                    {AdminArray.map((item, index)=>(
                        <li key={index}>{item}</li>
                    ))}
                    <form id="UsersWithAccess" >
                        <p id="text">Skriv inn bruker du ønsker å gi/fjerne adminrettigheter</p>
                        <input
                            id="emailInput"
                            placeholder="E-post"
                            type="text"
                            list="allUsers"
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                        <datalist id="allUsers">
                            {allUsers && allUsers.map((user, index) => (
                                <option key={index} value={user} />
                            ))}
                        </datalist>
                        <br/><br/>
                        <button id="addAdminBtn" onClick={addUser}>
                            Legg til
                        </button>
                        <button id="removeAdminBtn" onClick={removeUser}>
                            Fjern
                        </button>
                    </form>
                </div>
            )}
            {!isAdmin && (
                <p id="text">Du har dessverre ikke adminrettigheter</p>
            )}
        </div>
    );

}

export default AdminPanel; 