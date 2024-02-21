import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import FlashCard from "./FlashCard";
import useCardStrings from "./FlashCardSet";
import { useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

interface FlashCardParentProps {}

function FlashCardParent(props: FlashCardParentProps) {
  const location = useLocation();
  const id = location.state.id;
  const { cardsData, fetchData } = useCardStrings(id);
  const [studySet, setStudySet] = useState<
    { front: string; back: string; id: string; difficultState: boolean }[]
  >([]);
  const [card, setCard] = useState(0);
  const [side, setSide] = useState(0);
  const [text, setText] = useState("Laster inn..");

  useEffect(() => {
    if (cardsData) {
      const duplicatedCards = cardsData.reduce((accumulator, currentCard) => {
        accumulator.push(currentCard);
        if (currentCard.difficultState) {
          accumulator.push({
            ...currentCard,
            id: `${currentCard.id}-duplicate`,
          });
        }
        return accumulator;
      }, [] as typeof cardsData);
      setStudySet(duplicatedCards);
    }
  }, [cardsData]);

  useEffect(() => {
    if (studySet[card]) {
      setText(studySet[card].front);
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
      setText(studySet[card].back);
      setSide(1);
    } else {
      setText(studySet[card].front);
      setSide(0);
    }
  };

  const handleShuffleCards = () => {
    const shuffledStudySet = [...studySet];
    const currentCardText = studySet[card].front;

    for (let i = shuffledStudySet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledStudySet[i], shuffledStudySet[j]] = [
        shuffledStudySet[j],
        shuffledStudySet[i],
      ];
    }

    const newCardIndex = shuffledStudySet.findIndex(
      (card) => card.front === currentCardText
    );

    setStudySet(shuffledStudySet);
    setCard(newCardIndex !== -1 ? newCardIndex : 0);
  };

  const handleDifficultState = async () => {
    if (studySet[card]) {
      const cardId = studySet[card].id;
      const currentDifficultState = studySet[card].difficultState;
      try {
        await updateDoc(doc(db, "flashcardSets", id, "cards", cardId), {
          difficultState: !currentDifficultState,
        });
        console.log(
          `Difficult state updated successfully - now ${!currentDifficultState}`
        );

        setStudySet((prevStudySet) => {
          const updatedStudySet = [...prevStudySet];
          updatedStudySet[card].difficultState = !currentDifficultState;

          // Duplicate the card in studySet if difficultState is set to true
          if (!currentDifficultState) {
            updatedStudySet.push({
              ...updatedStudySet[card],
              id: `${cardId}-duplicate`,
            });
            console.log("Card duplicated");
          } else {
            // If difficultState is set to false, remove the duplicated card
            const duplicateIndex = updatedStudySet.findIndex(
              (card) => card.id === `${cardId}-duplicate`
            );

            const originalIndex = updatedStudySet.findIndex(
              (card) => card.id === cardId.split("-", 1)[0]
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
        text={text}
        handleClickOnFlashCard={handleClickOnFlashCard}
        handleDifficultState={handleDifficultState}
      />
    </>
  );
}
export default FlashCardParent;
