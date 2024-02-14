import React, { useState } from 'react';
// import './FlashCardEditor.css'; 

interface FlashCardProps{
    text: string;
    handleTextChange: (newText:string) => void;
  }

  const FlashCardEditor: React.FC<FlashCardProps> = ({ text, handleTextChange }) => {
    return (
        <div className="flashcard">
            <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Her kan du skrive noko: " /*Vil vel egt ha teksten som er der frå før*/
            />
        </div>
    );
};

const Page: React.FC = () => {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    const handleSaveChanges = () => {
        /* Her må ej ordne korleis ting blir lagra so kortet liksom vert oppdatert*/
        console.log("Endringer er lagra!")
    }

    return (
        <div className="page">
            <div className="card-container">
                <FlashCardEditor text={text1} handleTextChange={setText1} />
                <FlashCardEditor text={text2} handleTextChange={setText2} />
            </div>
            <button id="saveChanges" onClick={handleSaveChanges}>Lagre</button>
        </div>
    );
};

  
  export default Page;
  