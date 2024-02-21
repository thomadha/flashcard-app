import React, { useEffect, useState } from 'react';
import useSetNames from "./FetchSetNames";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

export interface Item {
    id: string; // Add id property
    name: string; // Add name property
}

export interface GridItemArray {
    items: Item[];
}

function Grid(){
    const navigateTo = useNavigate();
    const { flashcardSetData, fetchData} = useSetNames(); // fetchData funksjon er hentet for å kunne oppdatere siden dersom en admin sletter
    const [itemsArray, setItemsArray] = useState<Item[]>([]);

    useEffect(() => {
        if (flashcardSetData) {
            setItemsArray(flashcardSetData);
        }
    }, [flashcardSetData]);

    const gotoPage = (id: string) => {
        navigateTo("/cards", { state: { id } });
    }

    const gotoEdit = (id: string) => (event: React.MouseEvent) => {
        event.stopPropagation();
        console.log("Editing ", id);
        const editArray = [id, "", false];
        navigateTo("/edit", { state: { editArray } });
    }

    const deleteSet = (id: string) => async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            if (id !== undefined) {
                console.log("Deleting ", id);
                const docRef = doc(db, "flashcardSets", id);
                await deleteDoc(docRef);
            }
        }
        catch (e) {
            return;
        }
    }
  
    return (
        <>
            <div className="grid-container">
                {itemsArray.map((item, index) => (
                    <div key={item.id} className="grid-item" onClick={() => gotoPage(item.id)}>
                        <div>{item.name}</div>
                        <button onClick={gotoEdit(item.id)}>Rediger</button>
                        <button className="deleteButton" onClick={(event) => deleteSet(item.id)(event)}> Slett </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Grid;