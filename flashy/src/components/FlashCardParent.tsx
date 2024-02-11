import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import FlashCard from "./FlashCard";

interface FlashCardParentProps {}

function FlashCardParent(props: FlashCardParentProps){

    const studySet: [string,string][] = [
        ["Hvilken gruppe er best i PU", "Gruppe 51 <3"], 
        ["Statsministeren i Norge", "Jonas Gahr Støre"],
        ["Hvor mange fylker i Norge", "15"]
    ];
    
    const [card, setCard] = useState(0); 
    const [side, setSide] = useState(0); 
    const [text, setText] = useState(studySet[0][0]);

    useEffect(() => {
        setText(studySet[card][0]);
    }, [card]);

    const handleBackClick = () => {
        if(card === 0){
          setCard(studySet.length - 1); 
        }
        else{
          setCard(card - 1); 
        }
        //setCard((prevCard) => (prevCard === 0 ? studySet.length - 1 : prevCard - 1));
        //chat foreslo dette, det er jo fancy med oneliners, men jeg hadde jo ikke kommet på det selv :)
    }
    
    const handleNextClick = () => {
        if(card === (studySet.length - 1)){
          setCard(0); 
        }
        else{
          setCard(card + 1); 
        }
        //setCard((prevCard) => (prevCard === studySet.length - 1 ? 0 : prevCard + 1));
    }

      
    const handleClickOnFlashCard = () => {
        if(side === 0){
          setText(studySet[card][1]);
          setSide(1); 
        }
        else{
          setText(studySet[card][0]);
          setSide(0);
        }
    }

    return(
        <>
            <Buttons handleBackClick={handleBackClick} handleNextClick={handleNextClick}/>
            <FlashCard text={text} handleClickOnFlashCard={handleClickOnFlashCard}/> 
        </>
    );
}

export default FlashCardParent; 