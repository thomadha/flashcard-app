import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const useSetNames = () => {
    const [flashcardSetData, setFlashcardSetData] = useState<{ id: string; name: string }[]>([]); // Array of objects with ID and name
  
    const fetchData = async () => {
      try {
        const cardsCollectionRef = collection(db, 'flashcardSets');
        const querySnapshot = await getDocs(cardsCollectionRef);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setFlashcardSetData(data);
        
      } catch (error) {
        console.error("Error fetching flashcard set data:", error);
      }
    };
    fetchData();
  
    return { flashcardSetData, fetchData};
}

export default useSetNames;
