import React, { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";

export interface Item {
    id: string; // Add id property
    name: string; // Add name property
}

export interface GridItemArray {
    items: Item[];
}

function Grid() {

    const { flashcardSetData, loading } = useSetNames();
    const [itemsArray, setItemsArray] = useState<Item[]>([]);

    useEffect(() => {
        if (!loading) {
            setItemsArray(flashcardSetData);
        }
    }, [loading, flashcardSetData]);

    return (
        <>
            <div className="grid-container">
                {itemsArray.map((item, index) => (
                    <div key={item.id} className="grid-item"> {/* Use 'item.id' as key */}
                        <div>{item.name}</div>
                        <button className="likeSet"> Like </button>
                        <button className="commentSet"> Comment </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Grid;
