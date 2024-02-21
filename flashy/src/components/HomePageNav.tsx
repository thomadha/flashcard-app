import { Link, useNavigate } from "react-router-dom";

function HomePageNav() {

    const navigateTo = useNavigate();

    const gotoEdit = (id: string) => {
        navigateTo("/edit", { state: { id } });
    }

    return (
        <div style={{ backgroundColor: "#DEFEDD" }} className="Container">
            <button id="HomePageNavButton">Mine sett</button>
            <button id="HomePageNavButton">Utforsk</button>
            <button id="HomePageNavButton">Favoritter</button>
            <button id="SearchSetButton">Søk</button>
            <button id="CreateSetButton" onClick={() => gotoEdit("new")}>Lag et nytt sett</button>
        </div>
    )
}

export default HomePageNav