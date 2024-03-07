import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { getAuth } from "firebase/auth";

function UserPanel(){
    const [email, setEmail] = useState("");
    //const userRef = doc(db, "user");
    const [userArray, setUserArray] = useState<string[]>([]);

    const [userIDs, setUserIDs] = useState<string[]>([]);

    // useEffect(() => {           DEN HER E SKUMMEL!!!!! CRASHA FIREBASE 
    //     const fetchUserIDs = async () => { 
    //         try {
    //             const usersCollectionRef = collection(db, 'user');
    //             const querySnapshot = await getDocs(usersCollectionRef);
    //             const ids = querySnapshot.docs.map(doc => doc.id);
    //             setUserIDs(ids);
    //             console.log(userIDs)
    //         } catch (error) {
    //             console.error('Error fetching user IDs:', error);
    //         }
    //     };
        //fetchUserIDs();

    // }, []);

    

    // async function CheckIfUsernameExists(){
        
    //     const auth = getAuth();
    //     const user = auth.currentUser;
    //     if(user != null && user.email != null){
    //         const mail = user.email;
    //         const userRef = doc(db, "user", "username");
    //         const userArrayDoc = await getDoc(userRef); 
    //         setUserArray(userArrayDoc.get("UserArray")); 
    //         return userArrayDoc.get("UserArray").includes(mail);
    //     } else{
    //         return false; 
    //     }
    // }

    // async function updateUsername(event: React.SyntheticEvent) {
    //     event.preventDefault();
    //     await updateDoc(userRef, {AdminArray: arrayUnion(email)})
    //     if(!userArray.includes(userID)){
    //         setUserArray([...userArray, userID]);
    //     }
    // }

    // useEffect(() => {
    //     const checkAdminStatus = async () => {
    //         const isAdminResult= await CheckIfAdmin();
    //         if(isAdminResult){
    //             setIsAdmin(true); 
    //         }
    //     };
    //     checkAdminStatus();
    // }, []);



    // async function addUser(event: React.SyntheticEvent) {
    //     event.preventDefault();
    //     await updateDoc(adminRef, {AdminArray: arrayUnion(email)})
    //     if(!AdminArray.includes(email)){
    //         setAdminArray([...AdminArray, email]);
    //     }
    // }

    // async function removeUser(event: React.SyntheticEvent) {
    //     event.preventDefault();
    //     await updateDoc(adminRef,{AdminArray: arrayRemove(email)})
    //     setAdminArray(AdminArray.filter(item => item !== email));
    // }

    return(
        <div></div>
        
        // <div id="divUser">
        //     {isAdmin && (
        //         <div>
        //             {AdminArray.map((item, index)=>(
        //                 <li key={index}>{item}</li>
        //             ))}
        //             <form id="UsersWithAccess" >
        //                 <p id="text">Skriv inn bruker du ønsker å gi/fjerne adminrettigheter</p>
        //                 <input
        //                     id="emailInput"
        //                     placeholder="E-post"
        //                     type="email"
        //                     onChange={(e) => setEmail(e.target.value)}
        //                 />
        //                 <br/><br/>
        //                 <button id="addAdminBtn" onClick={addUser}>
        //                     Legg til
        //                 </button>
        //                 <button id="removeAdminBtn" onClick={removeUser}>
        //                     Fjern
        //                 </button>
        //             </form>
        //         </div>
        //     )}
        //     {!isAdmin && (
        //         <p id="text">Du har dessverre ikke adminrettigheter</p>
        //     )}
        // </div>
    );

}

export default UserPanel; 