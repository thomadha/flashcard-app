import React from "react";

interface FlashCardProps {
  text: string;
  handleClickOnFlashCard: () => void;
  handleDifficultState: () => void;
}

function FlashCard({
  text,
  handleClickOnFlashCard,
  handleDifficultState,
}: FlashCardProps) {
  const handleDifficultClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleDifficultState();
  };

  return (
    <>
      <div id="flashCard" onClick={handleClickOnFlashCard}>
        <p id="flashCardText">{text}</p>
        <button id="DifficultCard" onClick={handleDifficultClick}>
          Vanskelig
        </button>
        <button id="EditFlashCard">Rediger</button>
      </div>
    </>
  );
}

export default FlashCard;
