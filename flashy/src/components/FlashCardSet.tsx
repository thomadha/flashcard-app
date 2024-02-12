import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import exp from 'constants';

export const useCardStrings = (flashCardSetId: string) => {
    const [cardsData, setCardsData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const cardsCollectionRef = collection(db, 'flashcardSets', flashCardSetId, 'cards');
        const querySnapshot = await getDocs(cardsCollectionRef);
        const data = querySnapshot.docs.map(doc => [doc.data().flashcardFront, doc.data().flashcardBack]);
        setCardsData(data);
        setLoading(false);
      };
      fetchData();
    }, [flashCardSetId]);
  
    return { cardsData, loading };
}

export default useCardStrings;