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
    return { flashcardSetData, fetchData};
}

export const useCardStrings = () => {
  const [cardsData, setCardsData] = useState<string[][] | null>(null);
  //const [cardsData, setCardsData] = useState<{ 0: string, 1: string, 2: string, 3: boolean }[] | null>(null);  

  const fetchData = async (flashCardSetId: string) => {
      const cardsCollectionRef = collection(db, 'flashcardSets', flashCardSetId, 'cards');
      const querySnapshot = await getDocs(cardsCollectionRef);
      const data = querySnapshot.docs.map(doc => [doc.data().flashcardFront, doc.data().flashcardBack, doc.id, Boolean(doc.data().DifficultCard)]);
      setCardsData(data);
    };
    return {cardsData, fetchData};
}
export default { useSetNames, useCardStrings };