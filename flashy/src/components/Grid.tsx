import React, { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { getAuth } from 'firebase/auth';
import AdminPanel from './AdminPanel';

export interface Item {
    id: string; // Add id property
    name: string; // Add name property
}

export interface GridItemArray {
    items: Item[];
}


function Grid(){
    const navigateTo = useNavigate();
    const { flashcardSetData, loading } = useSetNames();
    const [itemsArray, setItemsArray] = useState<Item[]>([]);

    const [isAdmin, setIsAdmin] = useState(false);
    const adminRef = doc(db, "Administratorer", "UsersWithAdmin");

    useEffect(() => {
        if (!loading) {
            setItemsArray(flashcardSetData);
        }
    }, [loading, flashcardSetData]);

    const gotoPage = () => {
        navigateTo("/cards")
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

    const deleteSet = (id: string) => {

    }
  
  return (
      <>
          <div className="grid-container">
              {itemsArray.map((item, index) => (
                  <div key={item.id} className="grid-item"> {/* Use 'item.id' as key */}
                      <div onClick={gotoPage}>{item.name}</div>
                      <button className="likeSet"> Like </button>
                      <button className="commentSet"> Comment </button>
                      {isAdmin && (
                        <button className="deleteButton" onClick={() => deleteSet(item.id)}> Slett </button>
                      )}
                  </div>
              ))}
          </div>
      </>
  );
}

export default Grid;
