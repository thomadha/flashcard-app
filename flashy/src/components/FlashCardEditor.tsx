import React, { useEffect, useState } from 'react';
import '../FlashCardEditor.css';
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase/firebase";
import { useCardStrings, useSetTags } from "./FetchFirestoreData";
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
    const [id, setId] = useState("AEM8Vg71YOYv1JwWOttA"); // Placeholder ID
    const [locationId, setName, isNew] = location.state.editArray; // ['', setName: string, newSet: Boolean ] - Info from createSet functions in HomePageNav.tsx

    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [dummy, setDummy] = useState(0)

    const {flashcardTags, fetchSetTags} = useSetTags();
    const [flashcardSetChosenTag, setFlashcardSetChosenTag] = useState<string>("Annet");
    const [isOptionsVisible, setOptionsVisible] = useState(false);
    
    const {cardsData, fetchData} = useCardStrings();
    const [studySet, setStudySet] = useState([[ "Laster inn..", "Laster inn..", "Laster inn..."]]);
    const [card, setCard] = useState(-1); 

    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    
    const user = auth.currentUser;

    useEffect(() => {
        if (isNew) {
            console.log("Will try generating new set with name: ", setName);
            const createDoc = async () => {
                const docRef = await addDoc(collection(db, "flashcardSets"), {
                    name: setName,
                    creatorId: user?.uid,
                    tag: flashcardSetChosenTag,
                    isFavorite: false,
                    isPublic: true //ENDRE PÅ DENNE NÅR GJØR OFFENTLIG TOGGLE BLIR IMPLEMENTERT
                });
                setId(docRef.id);
            };
            createDoc();
        }
        else {
            console.log("Will try setting id: ", locationId);
            setId(locationId);
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
        fetchData(id);
        fetchSetTags("");
        console.log("No vart eg kjørt")
        
      }, [dummy, id]);

    
    // Define handleSaveChanges here, outside useEffect
    const handleSaveChanges = async () => {
        try{
            if (studySet[card]) {
                console.log("Document updated with ID: ", studySet[card]);
                console.log(text2)
                const docRef = doc(db, "flashcardSets", id, "cards", studySet[card][2]);
                const docRef2 = doc(db, "flashcardSets", id);
                const docSnap = await getDoc(docRef2);
                if (docSnap.exists()) {
                    await setDoc(docRef2, { tag: flashcardSetChosenTag }, { merge: true });
                }

                await updateDoc(docRef, {
                    flashcardFront: text1,
                    flashcardBack: text2,
                }).then(() => setDummy(dummy + 1));
            

            } else {
                const docRef = await addDoc(collection(db, "flashcardSets", id, "cards"), {
                    flashcardFront: text1,
                    flashcardBack: text2
                });
                const docRef2 = doc(db, "flashcardSets", id);
                await setDoc(docRef2, { tag: flashcardSetChosenTag }, { merge: true });

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
        console.log(user?.email);
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
    }

    const handleButtonClick = () => {
        // Toggle the visibility of the options div when the button is clicked
        setOptionsVisible(!isOptionsVisible);
        console.log(flashcardTags)
    };

    const handleTagSelection = (tag:string) => {
        // Update the selected tag and hide the options div when a tag is selected
        setFlashcardSetChosenTag(tag);
        setOptionsVisible(false);
        console.log("Tag selection")
    };

    return (

        <div className="page">
    
            <div>
                <p>Legg til et FlashCard Set blant settene til {user?.email}</p>

                <nav role="setNavbar" style={{display: "flex", justifyContent: "center", alignItems: "flex-start", marginBottom: "75px"}}>

                    {studySet.map((front, index) => (<button onClick={() => handleClickOnHeader(index)}> {front[0]} </button>))}

                    <button style={{background: "#76B27C", color: "black"}} onClick={() => handleClickOnHeaderNewFlashcard()}> Nytt flashcard </button>
                
                </nav>

            </div>

            <div className="cardfront">Framside</div>
            <div className="cardback">Bakside</div>

            <div className="dropdown">
                <button onClick={handleButtonClick}
                >Select Tag</button>
                {isOptionsVisible && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {flashcardTags.map((tag, index) => (
                        <div key={index} onClick={() => handleTagSelection(tag.tag)} 
                        style={{
                            padding: '5px',
                            cursor: 'pointer',
                            backgroundColor: flashcardSetChosenTag === tag.tag ? '#eee' : 'transparent',
                        }}>
                            {tag.tag}
                        </div>
                    ))}
                </div>
            )}
            </div>
            


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
