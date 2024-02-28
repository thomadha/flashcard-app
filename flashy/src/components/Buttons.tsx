interface ButtonsProps {
  handleBackClick: () => void;
  handleNextClick: () => void;
  handleShuffleCards: () => void;
}

function Buttons({
  handleBackClick,
  handleNextClick,
  handleShuffleCards,
}: ButtonsProps) {
  return (
    <>
      <button id="BackButton" onClick={handleBackClick}>
        Forrige
      </button>
      <button id="NextButton" onClick={handleNextClick}>
        Neste
      </button>
      <button id="ShuffleCards" onClick={handleShuffleCards}>
        Tilfeldig rekkefølge
      </button>
    </>
  );
}

export default Buttons;
