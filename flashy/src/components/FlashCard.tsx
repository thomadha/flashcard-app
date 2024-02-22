import React, { useState } from "react";

interface FlashCardProps {
  text: string;
  handleClickOnFlashCard: () => void;
  handleDiffficultState: () => void;
}

function FlashCard({
  text,
  handleClickOnFlashCard,
  handleDiffficultState,
}: FlashCardProps) {
  const [isDuplicatedVisible, setIsDuplicatedVisible] = useState(false);
  const handleDifficultClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleDiffficultState();
    setIsDuplicatedVisible(!isDuplicatedVisible);
  };

  return (
    <>
      <div id="flashCard" onClick={handleClickOnFlashCard}>
        <p id="flashCardText">{text}</p>
        <button id="DifficultCard" onClick={handleDifficultClick}>
          Vanskelig
        </button>
        <button id="EditFlashCard">Rediger</button>
        {isDuplicatedVisible && <p id="DuplicatedCard">Prøv deg på denne igjen!</p>}
      </div>
    </>
  );
}

export default FlashCard;
