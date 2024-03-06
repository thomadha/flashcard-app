import React, { useEffect, useState } from 'react';
import { useSetNames } from "./FetchFirestoreData";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore";
import { isPropertySignature } from 'typescript';

export interface Item {
    id: string; // Add id property
    name: string; // Add name property
    creatorId: string // Add creator property
}

export interface GridItemArray {
    items: Item[];
}


interface gridProps {
    filter: string;
    searchItem: string // Pass down filter variable from parent, this will choose what will be in the grid.
}

const Grid: React.FC<gridProps> = ({filter, searchItem}) => { 
    const navigateTo = useNavigate();
    const { flashcardSetData, fetchData } = useSetNames(); // fetchData funksjon er hentet for å kunne oppdatere siden dersom en admin sletter   
    const [itemsArray, setItemsArray] = useState<Item[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const adminRef = doc(db, "Administratorer", "UsersWithAdmin");
    
    const [filteredNameID, setFilteredNameID] = useState<{ id: string; name: string; creatorId: string }[]>([]);

    

    useEffect(() => {
        console.log("ItemChange")
        const filtered = flashcardSetData.filter(item =>
            item.name.toLowerCase().startsWith(searchItem.toLowerCase())
        );
        setFilteredNameID(filtered);
    }, [searchItem, flashcardSetData]);



    useEffect(() => {
        fetchData(filter)
    }, [filter, ]);

    useEffect(() => {
        if (flashcardSetData) { 
            const isFiltered = flashcardSetData.some(item =>
                filteredNameID.some(filteredItem => filteredItem.id === item.id)
            );
            if (isFiltered) {
                setItemsArray(filteredNameID);
            }
            if (!isFiltered && searchItem.length > 0 ){
                setItemsArray([])
            }
        }
    }, [flashcardSetData, filteredNameID]);

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
            if (user != null && user.email != null) {
                const mail = user.email;
                const arrayRef = doc(db, "Administratorer", "UsersWithAdmin");
                const AdminArrayDoc = await getDoc(arrayRef);
                return AdminArrayDoc.get("AdminArray").includes(mail);
            } else {
                return false;
            }
    }
    
    const gotoPage = (id: string, creatorId: string) => {
        
        // pageArray sends set id and creator id, allowing us to use creator id to retrieve creator information later
        const pageArray = [id, creatorId];
        navigateTo("/cards", { state: { pageArray } });
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
                fetchData("");
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
                  <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id, item.creatorId)}>
                      <div>{item.name}</div>
                      <button onClick={gotoEdit(item.id)}>Rediger</button>
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
