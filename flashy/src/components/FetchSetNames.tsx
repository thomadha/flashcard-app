import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const useSetNames = () => {
    const [flashcardSetData, setFlashcardSetData] = useState<{ id: string; name: string, creatorId: string }[]>([]); // Array of objects with ID and name and creatorId
  
    const fetchData = async (userId: String) => {
      try {
        // Dersom man kaller fetchData med en ID skal man kun hente ut spesifikke sets
        // Mye duplikat-kode, kanskje endre?
        if (userId != ""){
          
          const cardsCollectionRef = collection(db, 'flashcardSets');
          const q = query(cardsCollectionRef, where("creatorId", "==", userId) )
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, creatorId: doc.data().creatorId }));
          setFlashcardSetData(data);        
        } else {
          const cardsCollectionRef = collection(db, 'flashcardSets');
          const querySnapshot = await getDocs(cardsCollectionRef);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, creatorId: doc.data().creatorId }));
          setFlashcardSetData(data);    
        }
        
      } catch (error) {
        console.error("Error fetching flashcard set data:", error);
      }
    };
    return { flashcardSetData, fetchData};
}

export default useSetNames;
