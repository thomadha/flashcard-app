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
    tag: string;
    setTag(tagChange: string): void;
}

const HomePageNav: React.FC<HomePageNavProps> = ({filter, setFilter, searchItem, setSearchItem, updatePage, tag, setTag}) => {

    const navigateTo = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [setName, setSetName] = useState("");

    const {flashcardTags, fetchSetTags} = useSetTags();
    const [flashcardSetChosenTag, setFlashcardSetChosenTag] = useState<string>('');
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

    // KNUT EIRIK:
    const handleButtonClick = () => {
        // Toggle the visibility of the options div when the button is clicked
        fetchSetTags("");
        setOptionsVisible(!isOptionsVisible);
    };

    const handleTagSelection = (tag:string) => {
        // Update the selected tag and hide the options div when a tag is selected
        setFlashcardSetChosenTag(tag);
        setOptionsVisible(false);
        setTag(tag)
    };

    return (
        <div id="HomePageNav" className="Container">
            <button id="HomePageNavButton" onClick={() => handlemip(0)}>Mine sett</button>
            <button id="HomePageNavButton" onClick={() => handlemip(1)}>Utforsk</button>
            <button id="HomePageNavButton" onClick={() => handlemip(2)}>Favoritter</button>
            {/* KNUT EIRIK START */}
            <button id="categoriesButton" onClick={handleButtonClick}>Kategorier</button>
            {isOptionsVisible && (
            <div className='tagBox' style={{ display: 'flex', flexDirection: 'column' }}>
                {/*DEFAULT:*/}
                <div onClick={() => handleTagSelection("")} 
                    style={{
                        padding: '5px',
                        cursor: 'pointer',
                        backgroundColor: flashcardSetChosenTag === "" ? '#EF8CAD' : 'transparent',
                    }}>
                        {"SE ALLE"}
                    </div>

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

            {(tag != "") && <p>KATEGORI VALGT: {tag}</p>}
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