import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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

export const usePublicState = () => {

  const [publicState, setpublicState] = useState<{ id: string; isPublic: boolean }[]>([]); // Object containing docId and isPublic boolean value

  const fetchPublicData = async (flashCardSetId: string) => {
    try {
      const documentSnapshot = await getDoc(doc(db, "flashcardSets", flashCardSetId));
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data(); // retrieve the document data
        if (data["isPublic"] === true) {
          // console.log("Boolean value is true");
        } else if (data["isPublic"] === false){
        //   console.log("Boolean value is false");
        } else {
          // console.log("Boolean value does not exist");
        }
        const publicStateData = { id: documentSnapshot.id, isPublic: data.isPublic };
        setpublicState([publicStateData]);        
      } else {
        console.warn("Document does not exist");
      }
    } catch (error) {
      console.error("Error fetching flashcard set public state:", error);
    }
  };
    return {publicState, fetchPublicData};
}


export default { useSetNames, useCardStrings, usePublicState };