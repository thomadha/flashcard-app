import React from "react";
import NavBar from "../components/NavBar";
import FlashCardEditor from "../components/FlashCardEditor";
import "./CardViewer.css";

function AddCards() {
  return (
    <div>
      <NavBar />
      <FlashCardEditor />
    </div>
  );
}

export default AddCards;
