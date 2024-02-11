interface FlashCardProps {
  text: string;
  handleClickOnFlashCard: () => void;
}

function FlashCard({text, handleClickOnFlashCard}: FlashCardProps) {
  return (
    <>
      <div id="flashCard" onClick={handleClickOnFlashCard}>
        <p id="flashCardText" >{text}</p>
      </div>
    </>
  );
}

export default FlashCard;