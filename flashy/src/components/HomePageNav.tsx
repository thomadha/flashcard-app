import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function HomePageNav() {

    const navigateTo = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [setName, setSetName] = useState("");

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

    return (
        <div style={{ backgroundColor: "#DEFEDD" }} className="Container">
            {/* <button id="HomePageNavButton">Mine sett</button>
            <button id="HomePageNavButton">Utforsk</button>
            <button id="HomePageNavButton">Favoritter</button>
            <button id="SearchSetButton">Søk</button> */}
            <button id="CreateSetButton" onClick={handleCreateSet}>Lag et nytt sett</button>
            {showModal && (
                <div>
                    <input type="text" value={setName} onChange={handleSetName} />
                    <button onClick={handleConfirmSetName}>Confirm</button>
                </div>
            )}
        </div>
    )
}

export default HomePageNav