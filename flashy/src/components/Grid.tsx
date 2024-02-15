import * as React from "react";
import { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";

export interface Item {
    //Kan starte med bare navn på settet også utvide etterhvert
    SetName: String;
}

export interface GridItemArray {
    items: {
        item: Item;
    };
}

function Grid() {

    const { flashcardSetNames, loading } = useSetNames();
    const [namesArray, setNamesArray] = useState([ "Laster inn.."]);
    const [text, setText] = useState(namesArray[0]);

    useEffect(() => {
      if (!loading) {
        setNamesArray(flashcardSetNames);
      }
    }, [loading, flashcardSetNames]);

    useEffect(() => {
      if (namesArray[0]) {
          setText(namesArray[0]);
      }
    }, [namesArray]);
    // const currentArray: GridItemArray = {
    //     //For loop som henter fra Firebase
    // }

    //lager alle divsa fra verdiene i arrayen 
    const Itemdivs: JSX.Element[] = [];
    for (const key in )

    // return (
    //     <>
    //         <div className="GridBody"></div>
    //         <div className="GridBody">
    //             {Itemdivs}
    //         </div>
    //     </>
    // )
  return (
    <>
      <div className="grid-container">
        <div className="grid-item">
          <button className="likeSet"> {text} </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
        <div className="grid-item">
          <button className="likeSet"> L </button>
          <button className="commentSet"> K </button>
        </div>
      </div>
    </>
  );
}

export default Grid;
