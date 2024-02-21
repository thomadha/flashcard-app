import { useEffect, useState } from 'react';
import { collection, getDocs, where, query } from "firebase/firestore";
import { db, auth } from "../lib/firebase/firebase";

export const useSetNames = () => {
    const [flashcardSetData, setFlashcardSetData] = useState<{ id: string; name: string }[]>([]); // Array of objects with ID and name
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            //muligens navigate til login her
            return;
          } 
          const q = query(collection(db, "flashcardSets"), where("creatorId", "==", currentUser.uid));
          const execquery = await getDocs(q);
          const data = execquery.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
          setFlashcardSetData(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching flashcard set data:", error);
          setLoading(false);
        }
      };
      fetchData();
    }, []);
  
    return { flashcardSetData, loading };
}

export default useSetNames;
