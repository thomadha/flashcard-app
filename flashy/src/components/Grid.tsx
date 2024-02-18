import React, { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";
import { useNavigate } from "react-router-dom";

export interface Item {
    id: string; // Add id property
    name: string; // Add name property
}

export interface GridItemArray {
    items: Item[];
}


function Grid(){
    const navigateTo = useNavigate();
    const { flashcardSetData, loading } = useSetNames();
    const [itemsArray, setItemsArray] = useState<Item[]>([]);

    useEffect(() => {
        if (!loading) {
            setItemsArray(flashcardSetData);
        }
    }, [loading, flashcardSetData]);

  const gotoPage = () => {
    navigateTo("/cards")
  }
  
  return (
      <>
          <div className="grid-container">
              {itemsArray.map((item, index) => (
                  <div key={item.id} className="grid-item"> {/* Use 'item.id' as key */}
                      <div onClick={gotoPage}>{item.name}</div>
                      <button className="likeSet"> Like </button>
                      <button className="commentSet"> Comment </button>
                  </div>
              ))}
          </div>
      </>
  );
}

export default Grid;
