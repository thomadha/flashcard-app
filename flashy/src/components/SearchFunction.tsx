import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";


export const SearchFunction:React.FC = () => {

    const [flashcardSetNameID, setFlashcardSetNameID] = useState<{ id: string; name: string }[]>([]);
    const [searchItem, setSearchItem] = useState('')
    // set the initial state of filteredUsers to an empty array
    const [filteredNameID, setFilteredNameID] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => { //Kallar han for mange gangar på DB no?
        const fetchFlashcardSets = async () => {
            try {
                const cardsCollectionRef = collection(db, 'flashcardSets');
                const querySnapshot = await getDocs(cardsCollectionRef);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
                setFlashcardSetNameID(data);
                setFilteredNameID(data)
            } catch (error) {
                console.error("Error fetching flashcard set data:", error);
            }
        };

        fetchFlashcardSets(); // Call the function to fetch flashcard sets when the component mounts
    }, []); // Empty dependency array ensures this effect runs only once on mount


    // Eventuel løsning dersom for mange kall. Gjere at den kun kallast når nytt sett lagast og ved start

    // const [fetchDataFlag, setFetchDataFlag] = useState(false);
    // const handleButtonClick = () => {
    //     setFetchDataFlag(true); // Set flag to true when button is clicked
    // };

    // useEffect(() => {
    //     if (fetchDataFlag) {
    //         fetchFlashcardSets(); // Fetch data when fetchDataFlag is true
    //         setFetchDataFlag(false); // Reset the flag after fetching data
    //     }
    // }, [fetchDataFlag]); // Run the effect when fetchDataFlag changes
    

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => { 
        setSearchItem(event.target.value)
    }

    useEffect(() => {
        // Filter data based on searchItem
        const filtered = flashcardSetNameID.filter(item =>
            item.name.toLowerCase().startsWith(searchItem.toLowerCase())
        );
        setFilteredNameID(filtered);
        //console.log(filteredNameID)
    }, [searchItem, flashcardSetNameID]);
    
      return (
          
        <div> 
            {filteredNameID.map(item => (
                <div key={item.id}>{item.name}</div>
            ))} 
        <input
            type="text"
            value={searchItem}
            onChange={handleInputChange}
            placeholder='Type to search'
        />
        </div>
        
    )
    
    
}

export default SearchFunction;
