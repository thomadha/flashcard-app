import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export const FetchFlashCardset = (flashCardSetId: string) => {
  const [cardsData, setCardsData] = useState<string[][] | null>(null);
  const [docId, setnData] = useState<string>(flashCardSetId);
  

    const fetchData = async () => {
      const cardsCollectionRef = collection(db, 'flashcardSets', docId);
      const querySnapshot = await getDocs(cardsCollectionRef);
      const data = querySnapshot.docs.map(doc => [doc.data().flashcardFront, doc.data().flashcardBack, doc.id]);
      setCardsData(data);
    };

    useEffect(() => {
      
      fetchData();
    }, [flashCardSetId]);
  
    return {cardsData, fetchData, docId};
}

export const AddNewFlashcardset = () => {
    const [cardsData, setCardsData] = useState<string[][]>([["","","",""]]);
    const [docId, setnData] = useState("");

  const fetchData = async () => {
    const collectionRef = collection(db, 'flashcardSets');
    const docRef = await addDoc(collectionRef, {
      field1: "Hei",
      field2: "heisann"
    });
      let a = docRef.id;
      setnData(a);
    };
  fetchData();
  return {cardsData, fetchData};
}

export default AddNewFlashcardset;