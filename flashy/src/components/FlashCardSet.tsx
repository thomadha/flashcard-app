import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import exp from 'constants';

export const useCardStrings = (flashCardSetId: string) => {
    const [cardsData, setCardsData] = useState<string[][] | null>(null);
  

    const fetchData = async () => {
      const cardsCollectionRef = collection(db, 'flashcardSets', flashCardSetId, 'cards');
      const querySnapshot = await getDocs(cardsCollectionRef);
      const data = querySnapshot.docs.map(doc => [doc.data().flashcardFront, doc.data().flashcardBack, doc.id]);
      setCardsData(data);
    };
    return {cardsData, fetchData};
}

export default useCardStrings;