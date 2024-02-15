import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import exp from 'constants';

export const useSetNames = () => {
    const [flashcardSetNames, setflashcardSetNamesData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const cardsCollectionRef = collection(db, 'flashcardSets');
        const querySnapshot = await getDocs(cardsCollectionRef);
        const data = querySnapshot.docs.map(doc => doc.data().name);
        setflashcardSetNamesData(data);
        setLoading(false);
      };
      fetchData();
    }, []);
  
    return { flashcardSetNames, loading };
}

export default useSetNames;