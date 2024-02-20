import React, { useEffect, useState } from 'react';
import '../FlashCardEditor.css';
import { doc, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import UseCardStrings, { useCardStrings } from "./FlashCardSet";

interface FlashCardProps{
    text: string;
    handleTextChange: (newText:string) => void;
}

const FlashCardEditor: React.FC<FlashCardProps> = ({text, handleTextChange }) => {

    return (
        <div className="flashcard">
            <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={"Her kan du skrive noko: "}
            />
        </div>
    );
};

const Page: React.FC = () => {

    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [dummy, setDummy] = useState(0)
    

    //const [cardsData, setCardsData] = useState(UseCardStrings("uL5B3RmmHwv8fI57sdPy"));

    const {cardsData, fetchData} = UseCardStrings("uL5B3RmmHwv8fI57sdPy");
    const [studySet, setStudySet] = useState([[ "Laster inn..", "Laster inn..", "Laster inn..."]]);
    const [card, setCard] = useState(-1); 

    const [savedMessage, setSavedMessage] = useState<string | null>(null);


    // Check if card is selected for editing, or making new card
    useEffect(() => { 
        if (studySet[card]) {
            setText1(studySet[card][0]);
            setText2(studySet[card][1]);
        } else {
            setText1(""); // or set it to an empty string or any other default value
            setText2(""); // or set it to an empty string or any other default value
        }
    }, [card]);

    

    
    // Constant updating of setStudySet
    useEffect(() => { 
        if (cardsData) {
          setStudySet(cardsData);
        }
      }, [cardsData]);

    // Updates cardsData with function from useCardStrings, when dummy value is changed
    // Dummy value is changed when updating, adding or deleting card.
    useEffect(() => { 
        fetchData();
        
      }, [dummy]);

    
    // Define handleSaveChanges here, outside useEffect
    const handleSaveChanges = async () => {
        try{
            if (studySet[card]) {
                console.log("Document updated with ID: ", studySet[card]);
                console.log(text2)
                const docRef = doc(db, "flashcardSets", "uL5B3RmmHwv8fI57sdPy", "cards", studySet[card][2]);

                await updateDoc(docRef, {
                    flashcardFront: text1,
                    flashcardBack: text2
                }).then(() => setDummy(dummy + 1));
            

            } else {
                const docRef = await addDoc(collection(db, "flashcardSets", "uL5B3RmmHwv8fI57sdPy", "cards"), {
                    flashcardFront: text1,
                    flashcardBack: text2
                });

                if (docRef){
                    setDummy(dummy + 1);
                }
                
                console.log("Document written with ID: ", docRef.id);
            }
            setSavedMessage("Endringene ble lagret."); // Set saved message
            setTimeout(() => {
                setSavedMessage(null); // Clear saved message after 3 seconds
            }, 3000);
            
            setText1("");
            setText2("");

        } catch (error) {
            console.error("Problemer ved lagring:", error);
    }
    };

    // Click to select different card for editing
    const handleClickOnHeader = (i: number) => {
        setCard(i);
        console.log(i);
    }

    // Extra button to add new card
    const handleClickOnHeaderNewFlashcard = () => {
        setCard(-1);
    }

    // Deleting card
    const handleDeleteCard = async () => {
        console.log(studySet[card][2])

        const docRef = doc(db, "flashcardSets", "uL5B3RmmHwv8fI57sdPy", "cards", studySet[card][2]);

        await deleteDoc(docRef).then(() => setDummy(dummy + 1));
        setCard(-1);
        
    }



    return (
        
        <div className="page">
            
            <nav role="setNavbar">
                {studySet.map((front, index) => (
                    
                    <button onClick={() => handleClickOnHeader(index)}> {front[0]} </button>
                
                ))}
                <button style={{background: "yellow", color: "black"}} onClick={() => handleClickOnHeaderNewFlashcard()}> Nytt flashcard </button>
            </nav>

            <div className="cardfront">Framside yay</div>
            <div className="cardback">Bakside</div>
            <div className="card-container">
                <FlashCardEditor text={text1} handleTextChange={setText1} />
                <FlashCardEditor text={text2} handleTextChange={setText2} />
            </div>
            <button id="saveChanges" onClick={handleSaveChanges}>Lagre</button>
            <button style={{background: "red"}} onClick={handleDeleteCard}>Slett</button>
            
            {savedMessage && <div className="saved-message">{savedMessage}</div>}
        </div>
    );
};

export default Page;
