import React, { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from "firebase/firestore";
import { isPropertySignature } from 'typescript';

export interface Item {
    id: string; // Add id property
    name: string; // Add name property
}

export interface GridItemArray {
    items: Item[];
}


function Grid(){
    const navigateTo = useNavigate();
    const { flashcardSetData, fetchData } = useSetNames(); // fetchData funksjon er hentet for å kunne oppdatere siden dersom en admin sletter   
    const [itemsArray, setItemsArray] = useState<Item[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const adminRef = doc(db, "Administratorer", "UsersWithAdmin");

    const [flashcardSetNameID, setFlashcardSetNameID] = useState<{ id: string; name: string }[]>([]);
    const [searchItem, setSearchItem] = useState('')
    const [filteredNameID, setFilteredNameID] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => { 
        const fetchFlashcardSets = async () => {
            try {
                const cardsCollectionRef = collection(db, 'flashcardSets');
                const querySnapshot = await getDocs(cardsCollectionRef);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
                setFlashcardSetNameID(data);
                setFilteredNameID(data)
            } catch (error) {
                console.error("Error fetching flashcard set data:", error);
            }
        };
    
        fetchFlashcardSets(); // Call the function to fetch flashcard sets when the component mounts
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => { 
        setSearchItem(event.target.value)
    }

    useEffect(() => {
        const filtered = flashcardSetNameID.filter(item =>
            item.name.toLowerCase().startsWith(searchItem.toLowerCase())
        );
        setFilteredNameID(filtered);
    }, [searchItem, flashcardSetNameID]);



    useEffect(() => {
        fetchData()
    }, []);
    useEffect(() => {
        if (flashcardSetData ) { 
            const isFiltered = flashcardSetData.some(item =>
                filteredNameID.some(filteredItem => filteredItem.id === item.id)
            );
            if (isFiltered) {
                setItemsArray(filteredNameID);
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
                fetchData();
            }
        }
        catch (e) {
            return;
        }
    }
  
  return (
      <>
        <div className="search-bar"> 
            <input
                type="text"
                value={searchItem}
                onChange={handleInputChange}
                placeholder='Type to search'
            />
        </div>

          <div className="grid-container">
              {itemsArray.map((item, index) => (
                  <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id)}>
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
