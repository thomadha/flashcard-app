import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import exp from 'constants';

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

export default useCardStrings;