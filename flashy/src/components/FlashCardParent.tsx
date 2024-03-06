import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import FlashCard from "./FlashCard";
import { useCardStrings } from "./FetchFirestoreData";
import { useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

interface FlashCardParentProps {}

function FlashCardParent(props: FlashCardParentProps) {
  const location = useLocation();
  const id = location.state.id;
  // const { cardsData, fetchData} = UseCardStrings("uL5B3RmmHwv8fI57sdPy");
  //Cardsdata har [0] framsiden, [1] baksiden, [2] IDen til card collection
  const { cardsData, fetchData } = useCardStrings();
  //Framside og bakside av Flashcards
  const [studySet, setStudySet] = useState([
    ["Laster inn..", "Laster inn..", "Laster inn...", false],
  ]);
  const [card, setCard] = useState(0);
  const [side, setSide] = useState(0);
  const [text, setText] = useState(studySet[0][0]);
  /*   const [isDuplicatedVisible, setIsDuplicatedVisible] = useState(false); */

  useEffect(() => {
    fetchData(id);
  }, []);

  useEffect(() => {
    if (cardsData) {
      const extractedData = cardsData.map((card) => [
        card[0],
        card[1],
        card[2],
        Boolean(card[3]),
      ]);
      const duplicatedCards = cardsData.reduce((extractedData, currentCard) => {
        extractedData.push(currentCard);
        if (currentCard[3]) {
          extractedData.push([
            currentCard[0],
            currentCard[1],
            currentCard[2],
            currentCard[3],
          ]);
        }
        return extractedData;
      }, [] as typeof cardsData);
      setStudySet(extractedData);
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

  const handleDifficultState = async () => {
    if (studySet[card]) {
      const cardId = studySet[card][2];
      const currentDifficultState = studySet[card][3];
      try {
        await updateDoc(doc(db, "flashcardSets", id, "cards", String(cardId)), {
          difficultState: !currentDifficultState,
        });
        console.log(
          `Difficult state updated successfully - now ${!currentDifficultState}`
        );

        setStudySet((studySet) => {
          const updatedStudySet = [...studySet];
          updatedStudySet[card][3] = !currentDifficultState;

          // Duplicate the card in studySet if difficultState is set to true
          if (!currentDifficultState) {
            updatedStudySet.push([
              updatedStudySet[card][0],
              updatedStudySet[card][1],
              updatedStudySet[card][2] + "-duplicate",
              updatedStudySet[card][3],
            ]);
            /*             console.log("Card duplicated");
            if (studySet[card][3] === true) {
              setIsDuplicatedVisible(true);
            } */
          } else {
            // If difficultState is set to false, remove the duplicated card
            const duplicateIndex = updatedStudySet.findIndex(
              (card) => card[2] === `${cardId}-duplicate`
            );

            const originalIndex = updatedStudySet.findIndex(
              (card) => card[2] === String(cardId).split("-", 1)[0]
            );

            if (duplicateIndex !== -1) {
              updatedStudySet.splice(duplicateIndex, 1);
              console.log("Duplicated card removed");
            }

            if (originalIndex !== duplicateIndex) {
              updatedStudySet.splice(duplicateIndex, 1);
              console.log("Duplicated card removed");
            }
          }
          return updatedStudySet;
        });
      } catch (error) {
        console.error("Error updating difficult state:", error);
      }
    }
  };

  return (
    <>
      <Buttons
        handleBackClick={handleBackClick}
        handleNextClick={handleNextClick}
        handleShuffleCards={handleShuffleCards}
      />
      <FlashCard
        text={String(text)}
        handleClickOnFlashCard={handleClickOnFlashCard}
        handleDiffficultState={handleDifficultState}
      />
    </>
  );
}
export default FlashCardParent;
