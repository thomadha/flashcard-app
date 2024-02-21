import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const useCardStrings = (flashCardSetId: string) => {
    const [cardsData, setCardsData] = useState<{ front: string, back: string, id: string, difficultState: boolean }[] | null>(null);
  
    const fetchData = async () => {
      const cardsCollectionRef = collection(db, 'flashcardSets', flashCardSetId, 'cards');
      const querySnapshot = await getDocs(cardsCollectionRef);
      const data = querySnapshot.docs.map(doc => ({
        front: doc.data().flashcardFront,
        back: doc.data().flashcardBack,
        id: doc.id,
        difficultState: doc.data().difficultState
      }));
      setCardsData(data);
    };

    useEffect(() => {
      fetchData();
    }, [flashCardSetId]);
  
    return { cardsData, fetchData };
}

export default useCardStrings;