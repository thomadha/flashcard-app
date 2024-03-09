import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../lib/firebase/firebase";
import { useSetTags } from "./FetchFirestoreData";

interface HomePageNavProps {
    filter: string;
    setFilter: (filterChange:string) => void;
    searchItem: string;
    setSearchItem: (searchItemChange:string) => void;
    updatePage: (newValue: number) => void;
}

const HomePageNav: React.FC<HomePageNavProps> = ({filter, setFilter, searchItem, setSearchItem, updatePage}) => {

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
    const handlemip = (verdi : number) => {
        updatePage(verdi)
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
        <div style={{ backgroundColor: "#DEFEDD" }} className="Container">
            <button id="HomePageNavButton" onClick={() => handlemip(0)}>Mine sett</button>
            <button id="HomePageNavButton" onClick={() => handlemip(1)}>Utforsk</button>
            <button id="HomePageNavButton" onClick={() => handlemip(2)}>Favoritter</button>
            <div className="search-bar"> 
                <input
                    type="text"
                    value={searchItem}
                    onChange={handleInputChange}
                    placeholder='Type to search'
                />
            </div>
            {/* <div className="dropdown">
                <button className = "filter-dropdown">Filter</button>
                <div className="dropdown-content">
                <input type="checkbox" id="tag1" name="tag1" value="TAG1"></input>
                <label htmlFor="tag1"> Naturfag</label><br></br>
                <input type="checkbox" id="tag2" name="tag2" value="TAG2"></input>
                <label htmlFor="tag2"> Matte</label><br></br>
                <input type="checkbox" id="tag3" name="tag3" value="TAG3"></input>
                <label htmlFor="tag3"> Historie</label><br></br>
                <input type="checkbox" id="tag4" name="tag4" value="TAG4"></input>
                <label htmlFor="tag4"> Norsk</label><br></br>
                <input type="checkbox" id="tag5" name="tag5" value="TAG5"></input>
                <label htmlFor="tag5"> Engelsk</label><br></br>
                <input type="checkbox" id="tag6" name="tag6" value="TAG6"></input>
                <label htmlFor="tag6"> Geografi</label><br></br>
                <input type="checkbox" id="tag7" name="tag7" value="TAG7"></input>
                <label htmlFor="tag7"> Samfunn</label><br></br>
                <input type="checkbox" id="tag8" name="tag8" value="TAG8"></input>
                <label htmlFor="tag8"> PU</label>
            </div>
        </div> */}

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
export default HomePageNav;