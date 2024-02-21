import React, { useEffect, useState } from 'react';
import '../FlashCardEditor.css';
import { doc, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import UseCardStrings, { useCardStrings } from "./FlashCardSet";
import { useLocation } from "react-router-dom";

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
                placeholder={"Her kan du skrive noe: "}
            />
        </div>
    );
};

const Page: React.FC = () => {

    const location = useLocation();
    var id = location.state.id;

    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [dummy, setDummy] = useState(0)

    //const [cardsData, setCardsData] = useState(UseCardStrings("uL5B3RmmHwv8fI57sdPy"));

    const {cardsData, fetchData} = UseCardStrings(id);
    const [studySet, setStudySet] = useState([[ "Laster inn..", "Laster inn..", "Laster inn..."]]);
    const [card, setCard] = useState(-1); 

    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    
    useEffect(() => {
        console.log("Will try generating new set");
        if (id === "new") {
            const createDoc = async () => {
                const docRef = await addDoc(collection(db, "flashcardSets"), {
                    name: "Nytt sett"
                });
                console.log("Document written with ID: ", docRef.id);
                id = docRef.id;
            };
            createDoc();
        }
    }, []);

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
                const docRef = doc(db, "flashcardSets", id, "cards", studySet[card][2]);

                await updateDoc(docRef, {
                    flashcardFront: text1,
                    flashcardBack: text2
                }).then(() => setDummy(dummy + 1));
            

            } else {
                const docRef = await addDoc(collection(db, "flashcardSets", id, "cards"), {
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
        try {
            if (id !== undefined) {
                console.log(studySet[card][2])
                const docRef = doc(db, "flashcardSets", id, "cards", studySet[card][2]);
                await deleteDoc(docRef).then(() => setDummy(dummy + 1));
                setCard(-1);
            }
        }
        catch (e) {
            return;

        
    }


    return (

        <div className="page">
    
            <div>

                <nav role="setNavbar" style={{display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "75px"}}>

                    {studySet.map((front, index) => (<button onClick={() => handleClickOnHeader(index)}> {front[0]} </button>))}

                    <button style={{background: "#76B27C", color: "black"}} onClick={() => handleClickOnHeaderNewFlashcard()}> Nytt flashcard </button>
                
                </nav>

            </div>

            <div className="cardfront">Framside</div>
            <div className="cardback">Bakside</div>
            <div className="card-container">
                <FlashCardEditor text={text1} handleTextChange={setText1} />
                <FlashCardEditor text={text2} handleTextChange={setText2} />
            </div>
            <button id="saveChanges" onClick={handleSaveChanges}>Lagre</button>
            <button style={{background: "#76B27C"}} onClick={handleDeleteCard}>Slett</button>
            
            {savedMessage && <div className="saved-message">{savedMessage}</div>}

        </div>
    );
};

export default Page;
