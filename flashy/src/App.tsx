import React from "react";
import NavBar from "./components/NavBar";
import FlashCard from "./components/FlashCard";
import Buttons from "./components/Buttons";
import FlashCardParent from "./components/FlashCardParent";
import "./App.css";

function App() {
  return (
    <div>
      <NavBar />
      <FlashCardParent />
    </div>
  );
}

export default App;
