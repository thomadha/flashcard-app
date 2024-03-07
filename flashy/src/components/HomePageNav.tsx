import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../lib/firebase/firebase";

interface HomePageNavProps {
    filter: string;
    setFilter: (filterChange:string) => void;
    searchItem: string;
    setSearchItem: (searchItemChange:string) => void;
}

const HomePageNav: React.FC<HomePageNavProps> = ({filter, setFilter, searchItem, setSearchItem}) => {

    const navigateTo = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [setName, setSetName] = useState("");

    const user = auth.currentUser


    const gotoEdit = (setName: string, newSet: Boolean) => {
        const editArray = ["", setName, newSet];
        navigateTo("/edit", { state: { editArray } });
    }

    const handleCreateSet = () => {
        setShowModal(true);
    }

    const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSetName(event.target.value);
    }

    const handleConfirmSetName = () => {
        setShowModal(false);
        gotoEdit(setName, true);
    }

    // Functions to differentiate between explore and my own:
    const handleFilterClick = () => {
        if (user?.uid) {
            setFilter(user?.uid)
        }
    }

    const handleExploreClick = () => {
        setFilter('')
    }

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => { 
        setSearchItem(event.target.value)
    }

    return (
        <div id="homePageNav" className="Container">
            {/* <button id="HomePageNavButton">Mine sett</button>
            <button id="HomePageNavButton">Utforsk</button>
            <button id="HomePageNavButton">Favoritter</button>
            <button id="SearchSetButton">Søk</button> */}
            <button className="homeNavButtons" onClick={handleFilterClick}>Mine sett</button>
            <button className="homeNavButtons" onClick={handleExploreClick}>Utforsk</button>
            <div className="search-bar"> 
                <input
                    type="text"
                    value={searchItem}
                    onChange={handleInputChange}
                    placeholder='Type to search'
                />
            </div>

            <button id="CreateSetButton" onClick={handleCreateSet}>Lag et nytt sett</button>
            {showModal && (
                <div>
                    <input type="text" value={setName} onChange={handleSetName} placeholder="Skriv inn navn..." />
                    <button onClick={handleConfirmSetName}>Bekreft</button>
                </div>
            )}
        </div>
    )
}

export default HomePageNav