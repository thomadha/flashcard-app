import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import FlashCard from "./FlashCard";
import UseCardStrings, { FetchFlashCardset } from "./FlashCardSet";
import { useLocation } from "react-router-dom";

interface FlashCardParentProps {}

function FlashCardParent(props: FlashCardParentProps){

    const location = useLocation();
    const id = location.state.id;
    // const { cardsData, fetchData} = UseCardStrings("uL5B3RmmHwv8fI57sdPy");
    const { cardsData, fetchData} = FetchFlashCardset(id);
    const [studySet, setStudySet] = useState([[ "Laster inn..", "Laster inn.."]]);
    const [card, setCard] = useState(0); 
    const [side, setSide] = useState(0); 
    const [text, setText] = useState(studySet[0][0]);

    useEffect(() => {
      if (cardsData) {
        setStudySet(cardsData);
      }
    }, [cardsData]);

  useEffect(() => {
    if (studySet[card]) {
      setText(studySet[card][0]);
    }
  }, [card, studySet]);

  const handleBackClick = () => {
    if (card === 0) {
      setCard(studySet.length - 1);
    } else {
      setCard(card - 1);
    }
  };

  const handleNextClick = () => {
    if (card === studySet.length - 1) {
      setCard(0);
    } else {
      setCard(card + 1);
    }
  };

  const handleClickOnFlashCard = () => {
    if (side === 0) {
      setText(studySet[card][1]);
      setSide(1);
    } else {
      setText(studySet[card][0]);
      setSide(0);
    }
  };

  const handleShuffleCards = () => {
    const shuffledStudySet = [...studySet];
    const currentCardText = studySet[card][0];

    for (let i = shuffledStudySet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledStudySet[i], shuffledStudySet[j]] = [
        shuffledStudySet[j],
        shuffledStudySet[i],
      ];
    }

    const newCardIndex = shuffledStudySet.findIndex(
      ([front]) => front === currentCardText
    );

    setStudySet(shuffledStudySet);
    setCard(newCardIndex !== -1 ? newCardIndex : 0);
  };

  return (
    <>
      <Buttons
        handleBackClick={handleBackClick}
        handleNextClick={handleNextClick}
        handleShuffleCards={handleShuffleCards}
      />
      <FlashCard text={text} handleClickOnFlashCard={handleClickOnFlashCard} />
    </>
  );
}
export default FlashCardParent;
