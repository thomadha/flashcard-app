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

    const {flashcardTags, fetchSetTags} = useSetTags();
    const [flashcardSetChosenTag, setFlashcardSetChosenTag] = useState<string>("");
    const [isOptionsVisible, setOptionsVisible] = useState(false);

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
    const handlePageChange = (verdi : number) => {
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

    const handleButtonClick = () => {
        // Toggle the visibility of the options div when the button is clicked
        fetchSetTags("");
        setOptionsVisible(!isOptionsVisible);
    };

    const handleTagSelection = (tag:string) => {
        // Update the selected tag and hide the options div when a tag is selected
        setFlashcardSetChosenTag(tag);
        setOptionsVisible(false);
        setSearchItem(tag)
    };
 
    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => { 
        setSearchItem(event.target.value)
    }

    return (
        <div style={{ backgroundColor: "#DEFEDD" }} className="Container">
            <button id="HomePageNavButton" onClick={() => handlePageChange(0)}>Mine sett</button>
            <button id="HomePageNavButton" onClick={() => handlePageChange(1)}>Utforsk</button>
            <button id="HomePageNavButton" onClick={() => handlePageChange(2)}>Favoritter</button>
            <button onClick={handleButtonClick}>Kategorier</button>
            {isOptionsVisible && (
            <div className='tagBox' style={{ display: 'flex', flexDirection: 'column' }}>
                {flashcardTags.map((tag, index) => (
                    <div key={index} onClick={() => handleTagSelection(tag.tag)} 
                    style={{
                        padding: '5px',
                        cursor: 'pointer',
                        backgroundColor: flashcardSetChosenTag === tag.tag ? '#EF8CAD' : 'transparent',
                    }}>
                        {tag.tag}
                    </div>
                ))}
            </div>
            )}
            <div className="search-bar"> 
                <input
                    type="text"
                    value={searchItem}
                    onChange={handleInputChange}
                    placeholder='Søk...'
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
export default HomePageNav;