import React, { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { getAuth } from 'firebase/auth';


export interface Item {
    id: string; // Add id property
    name: string; // Add name property
}

export interface GridItemArray {
    items: Item[];
}

function Grid(){
    const navigateTo = useNavigate();
    const { flashcardSetData, fetchData} = useSetNames(); // fetchData funksjon er hentet for å kunne oppdatere siden dersom en admin sletter
    const [itemsArray, setItemsArray] = useState<Item[]>([]);

    const [isAdmin, setIsAdmin] = useState(false);
    const adminRef = doc(db, "Administratorer", "UsersWithAdmin");

    useEffect(() => {
        if (flashcardSetData) {
            setItemsArray(flashcardSetData);
        }
    }, [flashcardSetData]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            const isAdminResult= await CheckIfAdmin();
            if(isAdminResult){
                setIsAdmin(true); 
            }
        };
        checkAdminStatus();
    }, []);

    async function CheckIfAdmin(){
        
        const auth = getAuth();
        const user = auth.currentUser;
        if(user != null && user.email != null){
            const mail = user.email;
            const arrayRef = doc(db, "Administratorer", "UsersWithAdmin");
            const AdminArrayDoc = await getDoc(arrayRef); 
            return AdminArrayDoc.get("AdminArray").includes(mail);
        } else{
            return false; 
        }
    }
    const gotoPage = (id: string) => {
        navigateTo("/cards", { state: { id } });
    }

    const gotoEdit = (id: string) => (event: React.MouseEvent) => {
        event.stopPropagation();
        console.log("Editing ", id);
        const editArray = [id, "", false];
        navigateTo("/edit", { state: { editArray } });
    }

    const deleteSet = (id: string) => async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            if (id !== undefined) {
                console.log("Deleting ", id);
                const docRef = doc(db, "flashcardSets", id);
                await deleteDoc(docRef);
            }
        }
        catch (e) {
            return;
        }
    }
  
  return (
      <>
          <div className="grid-container">
              {itemsArray.map((item, index) => (
                  <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id)}>
                      <div onClick={gotoPage}>{item.name}</div>
                      {isAdmin && (
                        <button className="deleteButton" onClick={(event) => deleteSet(item.id)(event)}> Slett </button>
                      )}
                  </div>
              ))}
          </div>
      </>
  );
}

export default Grid;