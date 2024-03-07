import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";
import { initLikes } from './GridHelper';

export const useSetNames = () => {
    const [flashcardSetData, setFlashcardSetData] = useState<{ id: string; name: string, creatorId: string, likes: number }[]>([]); // Array of objects with ID and name and creatorId
  
    const fetchData = async (userId: String, page:number) => {
        // Dersom man kaller fetchData med en ID skal man kun hente ut spesifikke sets
        // Mye duplikat-kode, kanskje endre?
    try {
        let userSetsQuery;
        let userSetsSnapshot;        
        switch (page) {
            case 0:
                userSetsQuery = query(
                    collection(db, 'flashcardSets'),
                    where('creatorId', '==', auth.currentUser?.uid)
                );
                userSetsSnapshot = await getDocs(userSetsQuery);
                break;
            case 1:
                userSetsQuery = query(
                    collection(db, 'flashcardSets'),
                    where('isPublic', '==', true)
                );
                userSetsSnapshot = await getDocs(userSetsQuery);
                break;
            case 2:
                userSetsQuery = query(
                    collection(db, 'flashcardSets'),
                    where('isFavorite', '==', true)
                );
                userSetsSnapshot = await getDocs(userSetsQuery);
                break;
            default:
                userSetsQuery = query(collection(db, 'flashcardSets'));
                userSetsSnapshot = await getDocs(userSetsQuery);
        }
        const userDataPromise = userSetsSnapshot.docs.map(async doc => ({ id: doc.id, name: doc.data().name, creatorId: doc.data().creatorId, likes: await initLikes(doc.id)}));
        const userData = await Promise.all(userDataPromise);
        setFlashcardSetData(userData);   
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