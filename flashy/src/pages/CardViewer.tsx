import React from "react";
import NavBar from "../components/NavBar";
import FlashCardParent from "../components/FlashCardParent";
import '../style/Style.css';
import CommenStructure from "../components/CommentStructure";

function CardViewer() {
  return (
    <div>
      <NavBar />
      <FlashCardParent />
      <CommenStructure />
    </div>
  );
}

export default CardViewer;
