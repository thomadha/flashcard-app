interface ButtonsProps {
  handleBackClick: () => void;
  handleNextClick: () => void;
}

function Buttons({ handleBackClick, handleNextClick }: ButtonsProps) {
  return (
    <>
      <button id="BackButton" onClick={handleBackClick}>
        Forrige
      </button>
      <button id="NextButton" onClick={handleNextClick}>
        Neste
      </button>
    </>
  );
}

export default Buttons;
