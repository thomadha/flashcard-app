import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../lib/firebase/firebase";

interface UserPageNavProps {
    filter: string;
    setFilter: (filterChange:string) => void;
    searchItem: string;
    setSearchItem: (searchItemChange:string) => void;
}

const UserPageNav: React.FC<UserPageNavProps> = ({filter, setFilter, searchItem, setSearchItem}) => {

    const navigateTo = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [setUsername, setSetUsername] = useState("");

    const user = auth.currentUser


    // Functions to differentiate between explore and my own:
    const handleProfileClick = () => {
        if (user?.uid) {
            setFilter(user?.uid)
        }
    }

    const handleAdminClick = () => {
        setFilter('')
    }

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => { 
        setSearchItem(event.target.value)
    }

    return (
        <div style={{ backgroundColor: "#DEFEDD" }} className="Container">
            {/* <button id="HomePageNavButton">Mine sett</button>
            <button id="HomePageNavButton">Utforsk</button>
            <button id="HomePageNavButton">Favoritter</button>
            <button id="SearchSetButton">Søk</button> */}
            <button onClick={handleProfileClick}>Min profil</button>
            <button onClick={handleAdminClick}>Admin</button>
            <div className="search-bar"> 
                <input
                    type="text"
                    value={searchItem}
                    onChange={handleInputChange}
                    placeholder='Type to search'
                />
            </div>
        </div>
    )
}

export default UserPageNav