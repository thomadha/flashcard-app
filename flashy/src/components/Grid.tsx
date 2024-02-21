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

    const gotoPage = (id: string) => {
        navigateTo("/cards", { state: { id } });
    }
  
    return (
        <>
            <div className="grid-container">
                {itemsArray.map((item, index) => (
                    <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id)}>
                        <div>{item.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Grid;
