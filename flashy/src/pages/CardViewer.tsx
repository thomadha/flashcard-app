import React from "react";
import NavBar from "../components/NavBar";
import FlashCardParent from "../components/FlashCardParent";
import '../style/Style.css';

function CardViewer() {
  return (
    <div>
      <NavBar />
      <FlashCardParent />
    </div>
  );
}

export default CardViewer;
