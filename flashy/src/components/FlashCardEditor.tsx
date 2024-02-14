import React, { useEffect, useState } from 'react';
import '../FlashCardEditor.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

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
                placeholder="Her kan du skrive noko: "
            />
        </div>
    );
};

const Page: React.FC = () => {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    // Define handleSaveChanges here, outside useEffect
    const handleSaveChanges = async () => {
        const docRef = await addDoc(collection(db, "flashcardSets", "uL5B3RmmHwv8fI57sdPy", "cards"), {
            flashcardFront: text1,
            flashcardBack: text2
        });
        console.log("Document written with ID: ", docRef.id);
    };

    useEffect(() => {
        // This useEffect now might be used for different side effects, if needed.
        // If you only wanted it to define handleSaveChanges, it can be removed.
    }, []);

    return (
        <div className="page">
            <div className="cardfront">Framside</div>
            <div className="cardback">Bakside</div>
            <div className="card-container">
                <FlashCardEditor text={text1} handleTextChange={setText1} />
                <FlashCardEditor text={text2} handleTextChange={setText2} />
            </div>
            <button id="saveChanges" onClick={handleSaveChanges}>Lagre</button>
        </div>
    );
};

export default Page;
