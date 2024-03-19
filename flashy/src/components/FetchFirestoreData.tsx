import { useEffect, useState } from 'react';
import { doc, collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";
import { initLikes, getUsername } from './GridHelper';

export const useSetNames = () => {
    const [flashcardSetData, setFlashcardSetData] = useState<{ id: string; name: string, creatorId: string, likes: number, tag:string , username: string}[]>([]); // Array of objects with ID and name and creatorId

    const fetchDataSetNames = async (userId: String, page:number) => {
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
        const userDataPromise = userSetsSnapshot.docs.map(async doc => ({ id: doc.id, name: doc.data().name, creatorId: doc.data().creatorId, likes: await initLikes(doc.id), tag: doc.data().tag, username: await getUsername(doc.data().creatorId) }));
        const userData = await Promise.all(userDataPromise);
        setFlashcardSetData(userData);   
      } catch (error) {
        console.error("Error fetching flashcard set data:", error);
      }
    };
    return { flashcardSetData, fetchDataSetNames};
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

export const useUserData = () => {
    
    const [userData, setUserData] = useState<{email: string, username:string} | null>(null);
    //const [userData, setUserData] = useState<string[][] | null>(null);

    const fetchUserData = async (userID: string) => {
        console.log(userID);
        const userDocRef = doc(db, 'user', userID);
        const querySnapshot = await getDoc(userDocRef);
        const data = await querySnapshot.data() as {email: string, username:string};

        //const userCollectionRef = collection(db, 'user');
        //const querySnapshot = await getDocs(userCollectionRef);
        //const data = querySnapshot.docs.map(doc => [doc.data().email, doc.data().username]);
        setUserData(data);
        
        
    };
    return {userData, fetchUserData};

    

}

export const useListAllUsers = () => {
  const [usersList, setUsersList] = useState<string[][] | null>(null);
  //const [cardsData, setCardsData] = useState<{ 0: string, 1: string, 2: string, 3: boolean }[] | null>(null);  

        const fetchAllUsers = async () => {
          const userCollectionRef = collection(db, 'user');
          const querySnapshot = await getDocs(userCollectionRef);
          const data = querySnapshot.docs.map(doc => doc.data().email);
          setUsersList(data);
        };
    return {usersList, fetchAllUsers};
}

export const useSetTags = () => {
  const [flashcardTags, setFlashcardTags] = useState<{tag:string}[]>([]);

  const fetchSetTags = async(userId:string) => {

    try {
      if (userId != ""){
        const cardsCollectionRef = collection(db, 'tags');
        const q = query(cardsCollectionRef, where("creatorId", "==", userId) )
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({tag: doc.data().tag }));
        setFlashcardTags(data);        
      } else {
        const cardsCollectionRef = collection(db, 'tags');
        const querySnapshot = await getDocs(cardsCollectionRef);
        const data = querySnapshot.docs.map(doc => ({tag: doc.data().tag }));
        setFlashcardTags(data);    
      }
    }
    catch (error){
      console.error("Error fetching flashcard tag data:", error);
    }
  };
  return {flashcardTags, fetchSetTags};
}
export default { useSetNames, useCardStrings, useUserData, usePublicState, useListAllUsers, useSetTags };
