import * as React from "react";

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

    const currentArray: GridItemArray = {
        //For loop som henter fra Firebase
    }

    //lager alle divsa fra verdiene i arrayen 
    const Itemdivs: JSX.Element[] = [];
    for (const key in )

    return (
        <>
            <div className="GridBody"></div>
            <div className="GridBody">
                {Itemdivs}
            </div>
        </>
    )
}

export default Grid;
