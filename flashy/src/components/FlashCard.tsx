interface FlashCardProps {
  text: string;
  handleClickOnFlashCard: () => void;
}

function FlashCard({ text, handleClickOnFlashCard }: FlashCardProps) {
  return (
    <>
      <div id="flashCard" onClick={handleClickOnFlashCard}>
        <p id="flashCardText">{text}</p>
        <button id="DifficultCard">Vanskelig</button>
        <button id="EditFlashCard">Rediger</button>
      </div>
    </>
  );
}

export default FlashCard;
